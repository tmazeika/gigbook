import { Schema } from '.';

interface Options {
  nonempty?: boolean;
  minLength?: number;
  maxLength?: number;
  oneOf?: readonly string[];
  regExp?: RegExp;
}

type NarrowedString<O extends Options> = O['oneOf'] extends readonly (infer T)[]
  ? T
  : string;

export function string<O extends Options>(
  options?: O,
): Schema<NarrowedString<O>>;

export function string(options?: Options): Schema<string>;

export function string(options?: Options): Schema<string> {
  return new (class extends Schema<string> {
    isType(v: unknown): v is string {
      if (typeof v !== 'string') {
        return false;
      }
      let ok = !options?.nonempty || v.length > 0;
      ok &&= options?.minLength === undefined || v.length >= options.minLength;
      ok &&= options?.maxLength === undefined || v.length <= options.maxLength;
      ok &&= options?.oneOf === undefined || options.oneOf.includes(v);
      ok &&= options?.regExp === undefined || options.regExp.test(v);
      return ok;
    }

    transform(v: string): string {
      return v;
    }
  })();
}
