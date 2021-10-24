import Fraction from 'fraction.js';
import { $string, createCodec, mapCodec, TypeCodec } from 'jval';
import { DateTime, Duration } from 'luxon';

const dateTimeCodec: TypeCodec<DateTime, string> = {
  schema: $string().thenMap(DateTime.fromISO),
  isType: DateTime.isDateTime,
  unwrap: (v) => v.toISO(),
};

const durationCodec: TypeCodec<Duration, string> = {
  schema: $string().thenMap(Duration.fromISO),
  isType: Duration.isDuration,
  unwrap: (v) => v.toISO(),
};

const fractionCodec: TypeCodec<Fraction, string> = {
  schema: $string().thenMap((v) => new Fraction(v)),
  isType: (v): v is Fraction => v instanceof Fraction,
  unwrap: (v) => v.toFraction(),
};

export const codec = createCodec(
  dateTimeCodec,
  durationCodec,
  fractionCodec,
  mapCodec,
);
