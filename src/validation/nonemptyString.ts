import { Schema, $string } from 'jval';

export const $nonemptyString = (): Schema<string> =>
  $string().thenMap(s => s.trim()).thenValidate(s => s.length > 0);
