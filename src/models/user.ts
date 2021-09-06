import { Prisma } from '@prisma/client';
import ClockifyApiClient from 'gigbook/clockify/client';
import { GetTransformFromSchema, object, string } from 'gigbook/validation';
import { nonemptyString } from 'gigbook/validation/ext';

export const userSchema = object({
  id: string().optional(),
  clockifyApiKey: string({ regExp: ClockifyApiClient.apiKeyRegExp }).nullable(),
  payeeName: nonemptyString().nullable(),
  payeeAddress: nonemptyString().nullable(),
  payeeDescription: nonemptyString().nullable(),
});

export type User = GetTransformFromSchema<typeof userSchema>;

export const userSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  clockifyApiKey: true,
  payeeName: true,
  payeeAddress: true,
  payeeDescription: true,
});
