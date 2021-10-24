import { Prisma } from '@prisma/client';
import ClockifyApiClient from 'gigbook/clockify/client';
import { $nonemptyString } from 'gigbook/validation/nonemptyString';
import { $null, $object, $string, $undefined, GetSchemaMappedType } from 'jval';

export const userSchema = $object({
  id: $string().or($undefined()),
  clockifyApiKey: $string().regExp(ClockifyApiClient.apiKeyRegExp).or($null()),
  payeeName: $nonemptyString().or($null()),
  payeeAddress: $nonemptyString().or($null()),
  payeeDescription: $nonemptyString().or($null()),
});

export type User = GetSchemaMappedType<typeof userSchema>;

export const userSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  clockifyApiKey: true,
  payeeName: true,
  payeeAddress: true,
  payeeDescription: true,
});
