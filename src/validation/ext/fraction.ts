import Fraction from 'fraction.js';
import { FractionTypeMeta, Type } from 'gigbook/json/types';
import { number, object, Schema, string } from 'gigbook/validation';

interface Options {
  min?: Fraction | string | number;
  max?: Fraction | string | number;
}

export const fraction = (
  options?: Options,
): Schema<FractionTypeMeta, Fraction> =>
  object({
    $type: number({ eq: Type.Fraction as const }),
    value: string().withValidator((s) => {
      let parsed: Fraction | undefined;
      try {
        parsed = new Fraction(s);
      } catch (err) {
        return false;
      }
      let ok = options?.min === undefined || parsed.compare(options.min) >= 0;
      ok &&= options?.max === undefined || parsed.compare(options.max) <= 0;
      return ok;
    }),
  }).withTransform((obj) => new Fraction(obj.value));
