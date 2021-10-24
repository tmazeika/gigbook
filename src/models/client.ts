import { Prisma } from '@prisma/client';
import { $currency, Currency } from 'gigbook/models/currency';
import { $nonemptyString } from 'gigbook/validation/nonemptyString';
import { $object, $string, $undefined, GetSchemaMappedType } from 'jval';

export const clientSchema = $object({
  id: $string().or($undefined()),
  name: $nonemptyString(),
  address: $nonemptyString(),
  currency: $currency(),
});

export type Client = GetSchemaMappedType<typeof clientSchema>;

export const clientSelect = Prisma.validator<Prisma.ClientSelect>()({
  id: true,
  name: true,
  address: true,
  currency: true,
});

export type DbClient = Prisma.ClientGetPayload<{ select: typeof clientSelect }>;

export const fromDb = (client: DbClient): Client => ({
  id: client.id,
  name: client.name,
  currency: client.currency as Currency,
  address: client.address,
});
