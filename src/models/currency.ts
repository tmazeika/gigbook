import { Schema, string } from 'gigbook/validation';

export const currencies = ['usd', 'gbp', 'jpy'] as const;

export type Currency = typeof currencies[number];

export const currencySchema: Schema<Currency> = string({ oneOf: currencies });
