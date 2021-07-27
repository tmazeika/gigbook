import * as db from '@prisma/client';
import Fraction from 'fraction.js';
import {
  GetCheckedSchema,
  isArray,
  isDateTimeString,
  isDurationString,
  isNumber,
  isObject,
  isString,
} from 'gigbook/util/validation';
import { DateTime, Duration } from 'luxon';

export interface InvoiceLineItem {
  project: string;
  task: string;
  rate: Fraction;
  duration: Duration;
}

export interface Invoice {
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
  };
  lineItems: InvoiceLineItem[];
}

const checkBodySchema = isObject({
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
  }),
  lineItems: isArray(
    isObject({
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
    },
    lineItems: invoice.lineItems.map((li) => ({
      project: li.project,
      task: li.task,
      rateN: li.rate.s * li.rate.n,
      rateD: li.rate.d,
      duration: li.duration.shiftTo('hours', 'seconds').toISO(),
    })),
  };
}

export function fromBody(body: unknown): Invoice | undefined {
  if (!checkBodySchema(body)) {
    return undefined;
  }
  return {
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
    },
    lineItems: body.lineItems.map((li) => ({
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
    },
    lineItems: invoice.lineItems.map((li) => ({
      project: li.project,
      task: li.task,
      rate: new Fraction(li.rateN, li.rateD),
      duration: Duration.fromISO(li.duration),
    })),
  };
}
