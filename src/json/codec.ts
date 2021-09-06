import Fraction from 'fraction.js';
import NumberInputValue from 'gigbook/util/numberInputValue';
import { dateTime, duration, fraction, map } from 'gigbook/validation/ext';
import { numberInputValue } from 'gigbook/validation/ext/numberInputValue';
import { DateTime, Duration } from 'luxon';
import {
  DateTimeTypeMeta,
  DurationTypeMeta,
  FractionTypeMeta,
  MapTypeMeta,
  NumberInputValueTypeMeta,
  Type,
} from '.';

type NoToJson<T> = T extends { toJSON(): unknown }
  ? {
      [K in Exclude<keyof T, 'toJSON'>]: NoToJson<T[K]>;
    }
  : {
      [K in keyof T]: NoToJson<T[K]>;
    };

export function stripToJson(v: unknown): unknown {
  if (Array.isArray(v)) {
    return v.map((e) => stripToJson(e));
  }
  if (typeof v !== 'object' || v === null) {
    return v;
  }
  if (v instanceof Date || v instanceof DateTime || v instanceof Duration) {
  }
}

export const encode = (v: unknown): string =>
  JSON.stringify(deepReplace('', v));

function deepReplace(k: string, v: unknown): unknown {
  const o = replacer(k, v);
  if (Array.isArray(o)) {
    return o.map((v, k) => deepReplace(String(k), v));
  }
  if (typeof o === 'object' && o !== null) {
    return Object.fromEntries(
      Object.entries(o).map(([k, v]) => [k, deepReplace(k, v)]),
    );
  }
  return o;
}

export const decode = (v: string): unknown => JSON.parse(v, reviver);

export function replacer(key: string, value: unknown): unknown {
  if (value instanceof Date) {
    return {
      $type: Type.DateTime,
      value: value.toISOString(),
    } as DateTimeTypeMeta;
  }
  if (DateTime.isDateTime(value)) {
    return {
      $type: Type.DateTime,
      value: value.toISO(),
    } as DateTimeTypeMeta;
  }
  if (Duration.isDuration(value)) {
    return {
      $type: Type.Duration,
      value: value.toISO(),
    } as DurationTypeMeta;
  }
  if (value instanceof Fraction) {
    return {
      $type: Type.Fraction,
      value: value.toFraction(),
    } as FractionTypeMeta;
  }
  if (value instanceof Map) {
    return {
      $type: Type.Map,
      value: [...value],
    } as MapTypeMeta;
  }
  if (value instanceof NumberInputValue) {
    return {
      $type: Type.NumberInputValue,
      value: value.text,
    } as NumberInputValueTypeMeta;
  }
  return value;
}

const dateTimeSchema = dateTime();
const durationSchema = duration();
const fractionSchema = fraction();
const mapSchema = map();
const numberInputValueSchema = numberInputValue();

export function reviver(key: string, value: unknown): unknown {
  if (dateTimeSchema.isType(value)) {
    return dateTimeSchema.transform(value);
  }
  if (durationSchema.isType(value)) {
    return durationSchema.transform(value);
  }
  if (fractionSchema.isType(value)) {
    return fractionSchema.transform(value);
  }
  if (mapSchema.isType(value)) {
    return mapSchema.transform(value);
  }
  if (numberInputValueSchema.isType(value)) {
    return numberInputValueSchema.transform(value);
  }
  return value;
}
