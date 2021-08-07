import * as db from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/index-browser';
import Fraction from 'fraction.js';
import { CurrencyFormatter } from 'gigbook/hooks/useCurrencyFormatter';
import { HoursFormatter } from 'gigbook/hooks/useHoursFormatter';
import {
  and,
  GetCheckedSchema,
  isArray,
  isDateTimeString,
  isDurationString,
  isNumber,
  isObject,
  isString,
} from 'gigbook/util/validation';
import { DateTime, Duration } from 'luxon';

export const exchangeRateFractionDigits = 6;

export interface InvoiceLineItem {
  id?: string;
  project: string;
  task: string;
  rate: Fraction;
  duration: Duration;
}

export interface Invoice {
  id?: string;
  reference: string;
  date: DateTime;
  period: {
    start: DateTime;
    end: DateTime;
  };
  payee: {
    name: string;
    description: string;
    address: string;
  };
  client: {
    name: string;
    address: string;
    currency: string;
  };
  billing: {
    increment: number;
    netTerms: number;
    currency: string;
    exchangeRate: Fraction;
  };
  lineItems: InvoiceLineItem[];
}

const checkBodySchema = isObject({
  id: isString({ optional: true }),
  reference: isString({ nonempty: true }),
  date: isDateTimeString(),
  period: isObject({
    start: isDateTimeString(),
    end: isDateTimeString(),
  }),
  payee: isObject({
    name: isString({ nonempty: true }),
    description: isString({ nonempty: true }),
    address: isString({ nonempty: true }),
  }),
  client: isObject({
    name: isString({ nonempty: true }),
    address: isString({ nonempty: true }),
    currency: isString({ length: 3 }),
  }),
  billing: isObject({
    increment: isNumber({ integer: true, min: 0 }),
    netTerms: isNumber({ integer: true, min: 0 }),
    currency: isString({ length: 3 }),
    exchangeRate: and(
      isString({ nonempty: true }),
      (v) => !Number.isNaN(Number(v)),
    ),
  }),
  lineItems: isArray(
    isObject({
      id: isString({ optional: true }),
      project: isString({ nonempty: true }),
      task: isString({ nonempty: true }),
      rateN: isNumber({ integer: true, min: 0 }),
      rateD: isNumber({ integer: true, min: 1 }),
      duration: isDurationString(),
    }),
  ),
});

export type BodyInvoice = GetCheckedSchema<typeof checkBodySchema>;

export function toBody(invoice: Invoice): BodyInvoice {
  return {
    id: invoice.id,
    reference: invoice.reference,
    date: invoice.date.toISO(),
    period: {
      start: invoice.period.start.toISO(),
      end: invoice.period.end.toISO(),
    },
    payee: {
      name: invoice.payee.name,
      description: invoice.payee.description,
      address: invoice.payee.address,
    },
    client: {
      name: invoice.client.name,
      address: invoice.client.address,
      currency: invoice.client.currency,
    },
    billing: {
      increment: invoice.billing.increment,
      netTerms: invoice.billing.netTerms,
      currency: invoice.billing.currency,
      exchangeRate: invoice.billing.exchangeRate
        .round(exchangeRateFractionDigits)
        .toString(),
    },
    lineItems: invoice.lineItems.map((li) => ({
      id: li.id,
      project: li.project,
      task: li.task,
      rateN: li.rate.s * li.rate.n,
      rateD: li.rate.d,
      duration: li.duration.shiftTo('hours', 'seconds').toISO(),
    })),
  };
}

export function fromBody(body: unknown): Invoice | undefined {
  try {
    return fromSafeBody(body);
  } catch (e) {
    return undefined;
  }
}

export function fromSafeBody(body: unknown): Invoice {
  if (!checkBodySchema(body)) {
    throw new Error('Invalid invoice body');
  }
  return {
    id: body.id,
    reference: body.reference,
    date: DateTime.fromISO(body.date),
    period: {
      start: DateTime.fromISO(body.period.start),
      end: DateTime.fromISO(body.period.end),
    },
    payee: {
      name: body.payee.name,
      description: body.payee.description,
      address: body.payee.address,
    },
    client: {
      name: body.client.name,
      address: body.client.address,
      currency: body.client.currency,
    },
    billing: {
      increment: body.billing.increment,
      netTerms: body.billing.netTerms,
      currency: body.billing.currency,
      exchangeRate: new Fraction(body.billing.exchangeRate),
    },
    lineItems: body.lineItems.map((li) => ({
      id: li.id,
      project: li.project,
      task: li.task,
      rate: new Fraction(li.rateN, li.rateD),
      duration: Duration.fromISO(li.duration),
    })),
  };
}

export function toDb(
  invoice: Invoice,
  userEmail: string,
): db.Prisma.InvoiceCreateInput {
  return {
    user: {
      connect: { email: userEmail },
    },
    reference: invoice.reference,
    date: invoice.date.toISO(),
    periodStart: invoice.period.start.toISO(),
    periodEnd: invoice.period.end.toISO(),
    payeeName: invoice.payee.name,
    payeeDescription: invoice.payee.description,
    payeeAddress: invoice.payee.address,
    clientName: invoice.client.name,
    clientAddress: invoice.client.address,
    clientCurrency: invoice.client.currency,
    billingIncrement: invoice.billing.increment,
    billingNetTerms: invoice.billing.netTerms,
    billingCurrency: invoice.billing.currency,
    exchangeRate: invoice.billing.exchangeRate
      .round(exchangeRateFractionDigits)
      .toString(),
    lineItems: {
      createMany: {
        data: invoice.lineItems.map((li) => ({
          project: li.project,
          task: li.task,
          rateN: li.rate.s * li.rate.n,
          rateD: li.rate.d,
          duration: li.duration.shiftTo('hours', 'seconds').toISO(),
        })),
      },
    },
  };
}

export function fromDb(
  invoice: db.Invoice & { lineItems: db.InvoiceLineItem[] },
): Invoice {
  return {
    id: String(invoice.id),
    reference: invoice.reference,
    date: DateTime.fromJSDate(invoice.date),
    period: {
      start: DateTime.fromJSDate(invoice.periodStart),
      end: DateTime.fromJSDate(invoice.periodEnd),
    },
    payee: {
      name: invoice.payeeName,
      address: invoice.payeeAddress,
      description: invoice.payeeDescription,
    },
    client: {
      name: invoice.clientName,
      address: invoice.clientAddress,
      currency: invoice.clientCurrency,
    },
    billing: {
      increment: invoice.billingIncrement,
      netTerms: invoice.billingNetTerms,
      currency: invoice.billingCurrency,
      exchangeRate: new Fraction(
        invoice.exchangeRate
          .toDP(exchangeRateFractionDigits, Decimal.ROUND_HALF_CEIL)
          .toString(),
      ),
    },
    lineItems: invoice.lineItems.map((li) => ({
      id: String(li.id),
      project: li.project,
      task: li.task,
      rate: new Fraction(li.rateN, li.rateD),
      duration: Duration.fromISO(li.duration),
    })),
  };
}

export interface InvoiceComputations {
  dueDate: DateTime;
  exchangedTotal: string;
  rawExchangedTotal: Fraction;
  lineItems: InvoiceLineItemAggregations;
}

export interface InvoiceAndComputations {
  invoice: Invoice;
  computations: InvoiceComputations;
}

export function computeInvoice(
  invoice: Invoice,
  locale?: string,
): InvoiceComputations {
  const exchangedCurrencyFormatter = new CurrencyFormatter(
    invoice.client.currency,
    locale,
  );
  const lineItems = aggregateInvoiceLineItems(invoice.lineItems, {
    currency: invoice.billing.currency,
    increment: invoice.billing.increment,
    locale,
  });
  const rawExchangedTotal = lineItems.rawTotal.mul(
    invoice.billing.exchangeRate,
  );
  const exchangedTotal = exchangedCurrencyFormatter.format(
    rawExchangedTotal.valueOf(),
  );

  return {
    dueDate: invoice.date.plus({ days: invoice.billing.netTerms }),
    exchangedTotal,
    rawExchangedTotal: rawExchangedTotal,
    lineItems,
  };
}

export interface InvoiceLineItemComputationOptions {
  currency: string;
  increment: number;
  locale?: string;
}

export interface InvoiceLineItemAggregations {
  all: InvoiceLineItemDisplay[];
  total: string;
  rawTotal: Fraction;
}

export function aggregateInvoiceLineItems(
  lineItems: InvoiceLineItem[],
  options: InvoiceLineItemComputationOptions,
): InvoiceLineItemAggregations {
  const computed = lineItems.map((li) => formatInvoiceLineItem(li, options));
  const rawTotal = computed.reduce(
    (sum, li) => sum.add(li.rawTotal),
    new Fraction(0),
  );
  const total = new CurrencyFormatter(options.currency, options.locale).format(
    rawTotal.valueOf(),
  );
  return {
    all: computed,
    total,
    rawTotal,
  };
}

export interface InvoiceLineItemDisplay {
  id?: string;
  project: string;
  task: string;
  rate: string;
  hours: string;
  total: string;
  rawTotal: Fraction;
}

export function formatInvoiceLineItem(
  lineItem: InvoiceLineItem,
  options: InvoiceLineItemComputationOptions,
): InvoiceLineItemDisplay {
  const currencyFormatter = new CurrencyFormatter(
    options.currency,
    options.locale,
  );
  const hoursFormatter = new HoursFormatter(options.locale);
  const rate = lineItem.rate.round(currencyFormatter.fractionDigits);
  const hours = durationToMinutes(lineItem.duration)
    .div(options.increment)
    .ceil()
    .mul(options.increment, 60)
    .round(hoursFormatter.fractionDigits);
  const total = rate.mul(hours).round(currencyFormatter.fractionDigits);

  return {
    id: lineItem.id,
    project: lineItem.project,
    task: lineItem.task,
    rate: currencyFormatter.format(rate.valueOf()),
    hours: hoursFormatter.format(hours.valueOf()),
    total: currencyFormatter.format(total.valueOf()),
    rawTotal: total,
  };
}

function durationToMinutes(duration: Duration): Fraction {
  const { minutes = 0, milliseconds = 0 } = duration
    .shiftTo('minutes', 'milliseconds')
    .toObject();
  return new Fraction(minutes).add(milliseconds ? 1 : 0);
}

// export async function hydrate(invoice: Invoice): Promise<HydratedInvoice> {
//   const res = await fetch(
//     buildRelUrl('/api/exchange-rate', {
//       from: invoice.billing.currency,
//       to: invoice.client.currency,
//       date: invoice.date.toISO(),
//     }),
//   );
//   const { rate } = (await res.json()) as ExchangeRateResponse;
//   return {
//     ...compute(invoice),
//     exchangeRate: rate,
//   };
// }
