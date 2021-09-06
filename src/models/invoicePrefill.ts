import { Prisma } from '@prisma/client';
import { currencySchema } from 'gigbook/models/currency';
import {
  GetTransformFromSchema,
  number,
  object,
  string,
} from 'gigbook/validation';

export const invoicePrefillSchema = object({
  payeeName: string(),
  payeeDescription: string(),
  payeeAddress: string(),
  clientName: string(),
  clientAddress: string(),
  clientCurrency: currencySchema,
  billingIncrement: number(),
  billingNetTerms: number(),
  billingCurrency: currencySchema,
}).partial();

export type InvoicePrefill = GetTransformFromSchema<
  typeof invoicePrefillSchema
>;

export const invoicePrefillSelect = Prisma.validator<Prisma.UserSelect>()({
  payeeName: true,
  payeeDescription: true,
  payeeAddress: true,
  invoices: {
    select: {
      payeeName: true,
      payeeDescription: true,
      payeeAddress: true,
      clientName: true,
      clientAddress: true,
      clientCurrency: true,
      billingIncrement: true,
      billingNetTerms: true,
      billingCurrency: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 1,
  },
});
