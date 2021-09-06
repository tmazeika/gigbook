import { Prisma } from '@prisma/client';
import { Currency, currencySchema } from 'gigbook/models/currency';
import { GetTransformFromSchema, object, string } from 'gigbook/validation';
import { nonemptyString } from 'gigbook/validation/ext';

export const clientSchema = object({
  id: string().optional(),
  name: nonemptyString(),
  address: nonemptyString(),
  currency: currencySchema,
});

export type Client = GetTransformFromSchema<typeof clientSchema>;

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
