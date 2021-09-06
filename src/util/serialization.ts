import Fraction from 'fraction.js';
import NumberInputValue from 'gigbook/util/numberInputValue';
import { DateTime, Duration } from 'luxon';

export type Serializable =
  | undefined
  | null
  | string
  | number
  | boolean
  | Serializable[]
  | { [K in string]: Serializable }
  // JSON ext types
  | DateTime
  | Duration
  | Fraction
  | Map<Serializable, Serializable>
  | NumberInputValue;

export type LossySerializable = Serializable | { toJSON(): LossySerializable };
