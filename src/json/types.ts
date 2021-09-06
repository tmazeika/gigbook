export enum Type {
  DateTime,
  Duration,
  Fraction,
  Map,
  NumberInputValue,
}

export interface TypeMeta {
  $type: Type;
  value: unknown;
}

export interface DateTimeTypeMeta extends TypeMeta {
  $type: Type.DateTime;
  value: string;
}

export interface DurationTypeMeta extends TypeMeta {
  $type: Type.Duration;
  value: string;
}

export interface FractionTypeMeta extends TypeMeta {
  $type: Type.Fraction;
  value: string;
}

export interface MapTypeMeta extends TypeMeta {
  $type: Type.Map;
  value: [unknown, unknown][];
}

export interface NumberInputValueTypeMeta extends TypeMeta {
  $type: Type.NumberInputValue;
  value: string;
}
