import { Prisma } from '@prisma/client';
import { $currency } from 'gigbook/models/currency';
import { $number, $object, $string, GetSchemaMappedType } from 'jval';

export const invoicePrefillSchema = $object({
  payeeName: $string(),
  payeeDescription: $string(),
  payeeAddress: $string(),
  clientName: $string(),
  clientAddress: $string(),
  clientCurrency: $currency(),
  billingIncrement: $number(),
  billingNetTerms: $number(),
  billingCurrency: $currency(),
}).partial();

export type InvoicePrefill = GetSchemaMappedType<
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
