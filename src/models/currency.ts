import { $string, Schema } from 'jval';

export const currencies = ['usd', 'gbp', 'jpy'] as const;

export type Currency = typeof currencies[number];

export const $currency = (): Schema<Currency> => $string().eq(...currencies);
