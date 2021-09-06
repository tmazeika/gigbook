import { Schema } from '.';

interface Options {
  eq?: number;
  min?: number;
  max?: number;
  integer?: boolean;
  allowInfinite?: boolean;
}

type NarrowedNumber<O extends Options> = O['eq'] extends number
  ? O['eq']
  : number;

export function number<O extends Options>(
  options: O,
): Schema<NarrowedNumber<O>>;

export function number(options?: Options): Schema<number>;

export function number(options?: Options): Schema<number> {
  return new (class extends Schema<number> {
    isType(v: unknown): v is number {
      if (typeof v !== 'number' || Number.isNaN(v)) {
        return false;
      }
      let ok = options?.eq === undefined || v === options.eq;
      ok &&= options?.min === undefined || v >= options.min;
      ok &&= options?.max === undefined || v <= options.max;
      ok &&= !options?.integer || Number.isSafeInteger(v);
      ok &&= options?.allowInfinite || Number.isFinite(v);
      return ok;
    }

    transform(v: number): number {
      return v;
    }
  })();
}
