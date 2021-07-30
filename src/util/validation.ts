import { DateTime, Duration } from 'luxon';

export type SchemaChecker<T> = (value: unknown) => value is T;

export type GetCheckedSchema<T> = T extends SchemaChecker<infer U> ? U : never;

export interface BaseOptions {
  optional?: boolean;
  nullable?: boolean;
}

export type Maybe<Options extends BaseOptions, T> =
  | Options['optional'] extends true
  ? T | undefined
  : T | Options['nullable'] extends true
  ? T | null
  : T;

function checkPresence<T, Options extends BaseOptions>(
  options: Options | undefined,
  f: SchemaChecker<T>,
): SchemaChecker<Maybe<Options, T>> {
  return (value: unknown): value is Maybe<Options, T> =>
    (options?.optional && value === undefined) ||
    (options?.nullable && value === null) ||
    f(value);
}

export interface IsDateTimeStringOptions extends BaseOptions {
  min?: DateTime;
  max?: DateTime;
}

export function isDateTimeString<Options extends IsDateTimeStringOptions>(
  options?: Options,
): SchemaChecker<Maybe<Options, string>> {
  return checkPresence(options, (value: unknown): value is string => {
    if (typeof value !== 'string') {
      return false;
    }
    const date = DateTime.fromISO(value);
    let ok = date.isValid;
    ok &&= !options?.min || date >= options.min;
    ok &&= !options?.max || date <= options.max;
    return ok;
  });
}

export interface IsDurationStringOptions extends BaseOptions {
  min?: Duration;
  max?: Duration;
}

export function isDurationString<Options extends IsDurationStringOptions>(
  options?: Options,
): SchemaChecker<Maybe<Options, string>> {
  return checkPresence(options, (value: unknown): value is string => {
    if (typeof value !== 'string') {
      return false;
    }
    const date = Duration.fromISO(value);
    let ok = date.isValid;
    ok &&= !options?.min || date >= options.min;
    ok &&= !options?.max || date <= options.max;
    return ok;
  });
}

export interface IsStringOptions extends BaseOptions {
  nonempty?: boolean;
  minLength?: number;
  maxLength?: number;
  length?: number;
  regex?: RegExp;
}

export function isString<Options extends IsStringOptions>(
  options?: Options,
): SchemaChecker<Maybe<Options, string>> {
  return checkPresence(options, (value: unknown): value is string => {
    if (typeof value !== 'string') {
      return false;
    }
    let ok = !options?.nonempty || value.length > 0;
    ok &&= !options?.minLength || value.length >= options.minLength;
    ok &&= !options?.maxLength || value.length <= options.maxLength;
    ok &&= !options?.length || value.length === options.length;
    ok &&= !options?.regex || options.regex.test(value);
    return ok;
  });
}

export interface IsNumberOptions extends BaseOptions {
  integer?: boolean;
  min?: number;
  max?: number;
}

export function isNumber<Options extends IsNumberOptions>(
  options?: Options,
): SchemaChecker<Maybe<Options, number>> {
  return checkPresence(options, (value: unknown): value is number => {
    if (typeof value !== 'number') {
      return false;
    }
    let ok = !options?.integer || Number.isSafeInteger(value);
    ok &&= options?.min === undefined || value >= options.min;
    ok &&= options?.max === undefined || value <= options.max;
    return ok;
  });
}

export type ObjectSchema = Record<PropertyKey, SchemaChecker<unknown>>;

export type GetCheckedObjectSchema<T extends ObjectSchema> = {
  [K in keyof T]: GetCheckedSchema<T[K]>;
};

export function isObject<T extends ObjectSchema, Options extends BaseOptions>(
  schema: T,
  options?: Options,
): SchemaChecker<Maybe<Options, GetCheckedObjectSchema<T>>> {
  return checkPresence(
    options,
    (value: unknown): value is GetCheckedObjectSchema<T> => {
      if (typeof value !== 'object' || value === null) {
        return false;
      }
      const obj = value as GetCheckedObjectSchema<T>;
      return Object.entries(schema).every(([k, check]) => check(obj[k]));
    },
  );
}

export function isArray<T, Options extends BaseOptions>(
  itemSchema: SchemaChecker<T>,
  options?: Options,
): SchemaChecker<Maybe<Options, T[]>> {
  return checkPresence(options, (value: unknown): value is T[] => {
    return Array.isArray(value) && value.every((v) => itemSchema(v));
  });
}

export function and<T>(
  schema: SchemaChecker<T>,
  check: (v: T) => boolean,
): SchemaChecker<T> {
  return (value: unknown): value is T => schema(value) && check(value);
}
