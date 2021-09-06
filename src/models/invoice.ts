import * as db from '@prisma/client';
import Fraction from 'fraction.js';
import { CurrencyFormatter } from 'gigbook/hooks/useCurrencyFormatter';
import { HoursFormatter } from 'gigbook/hooks/useHoursFormatter';
import { Currency, currencySchema } from 'gigbook/models/currency';
import {
  array,
  GetTransformFromSchema,
  number,
  object,
} from 'gigbook/validation';
import {
  dateTime,
  duration,
  fraction,
  nonemptyString,
} from 'gigbook/validation/ext';
import { DateTime, Duration } from 'luxon';

export const invoiceLineItemSchema = object({
  id: nonemptyString().optional(),
  project: nonemptyString(),
  task: nonemptyString(),
  rate: fraction({ min: 0 }),
  duration: duration({ min: Duration.fromObject({}) }),
});

export type InvoiceLineItem = GetTransformFromSchema<
  typeof invoiceLineItemSchema
>;

export const invoiceSchema = object({
  id: nonemptyString().optional(),
  reference: nonemptyString(),
  date: dateTime(),
  period: object({
    start: dateTime(),
    end: dateTime(),
  }),
  payee: object({
    name: nonemptyString(),
    description: nonemptyString(),
    address: nonemptyString(),
  }),
  client: object({
    name: nonemptyString(),
    address: nonemptyString(),
    currency: currencySchema,
  }),
  billing: object({
    increment: number({ integer: true, min: 0 }),
    netTerms: number({ integer: true }),
    currency: currencySchema,
    exchangeRate: fraction(),
  }),
  lineItems: array(invoiceLineItemSchema),
});

export type Invoice = GetTransformFromSchema<typeof invoiceSchema>;

export function createInvoice(id: string, userId: string, invoice: Invoice) {
  const exchangeRate = invoice.billing.exchangeRate;
  return db.Prisma.validator<db.Prisma.UserUpdateInput>()({
    invoices: {
      create: {
        id,
        reference: invoice.reference,
        date: invoice.date.toISO(),
        periodStart: invoice.period.start.toISO(),
        periodEnd: invoice.period.end.toISO(),
        payeeName: invoice.payee.name,
        payeeDescription: invoice.payee.description,
        payeeAddress: invoice.payee.address,
        clientName: invoice.client.name,
        clientCurrency: invoice.client.currency,
        clientAddress: invoice.client.address,
        billingIncrement: invoice.billing.increment,
        billingNetTerms: invoice.billing.netTerms,
        billingCurrency: invoice.billing.currency,
        exchangeRateN: exchangeRate.s * exchangeRate.n,
        exchangeRateD: exchangeRate.d,
        lineItems: {
          createMany: {
            data: invoice.lineItems.map((li) => ({
              project: li.project,
              task: li.task,
              rateN: li.rate.s * li.rate.n,
              rateD: li.rate.d,
              duration: li.duration
                .shiftTo('hours', 'minutes', 'seconds')
                .toISO(),
            })),
          },
        },
      },
    },
    clients: {
      upsert: {
        where: {
          userId_name: {
            userId,
            name: invoice.client.name,
          },
        },
        update: {
          currency: invoice.client.currency,
          address: invoice.client.address,
        },
        create: {
          name: invoice.client.name,
          currency: invoice.client.currency,
          address: invoice.client.address,
        },
      },
    },
  });
}

export const invoiceSelect = db.Prisma.validator<db.Prisma.InvoiceSelect>()({
  id: true,
  reference: true,
  date: true,
  periodStart: true,
  periodEnd: true,
  payeeName: true,
  payeeDescription: true,
  payeeAddress: true,
  clientName: true,
  clientCurrency: true,
  clientAddress: true,
  billingIncrement: true,
  billingNetTerms: true,
  billingCurrency: true,
  exchangeRateN: true,
  exchangeRateD: true,
  lineItems: {
    select: {
      id: true,
      project: true,
      task: true,
      rateN: true,
      rateD: true,
      duration: true,
    },
  },
});

export type DbInvoice = db.Prisma.InvoiceGetPayload<{
  select: typeof invoiceSelect;
}>;

export const fromDb = (invoice: DbInvoice): Invoice => ({
  id: invoice.id,
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
    currency: invoice.clientCurrency as Currency,
  },
  billing: {
    increment: invoice.billingIncrement,
    netTerms: invoice.billingNetTerms,
    currency: invoice.billingCurrency as Currency,
    exchangeRate: new Fraction(invoice.exchangeRateN, invoice.exchangeRateD),
  },
  lineItems: invoice.lineItems.map((li) => ({
    id: li.id,
    project: li.project,
    task: li.task,
    rate: new Fraction(li.rateN, li.rateD),
    duration: Duration.fromISO(li.duration),
  })),
});

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
  const minutes = durationToMinutes(lineItem.duration);
  const hours = (
    options.increment === 0
      ? minutes.div(60)
      : minutes.div(options.increment).ceil().mul(options.increment, 60)
  ).round(hoursFormatter.fractionDigits);
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
