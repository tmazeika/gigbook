import Fraction from 'fraction.js';
import { $custom, Schema } from 'jval';

export const $fraction = (options?: { min?: number }): Schema<Fraction> =>
  $custom((v): v is Fraction => v instanceof Fraction).thenValidate((v) =>
    options?.min !== undefined ? v.compare(options.min) >= 0 : true,
  );
