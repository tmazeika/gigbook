import { GetTransformFromSchema, GetTypeFromSchema, Schema } from '.';

type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;

type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

interface Options {
  length?: number;
  minLength?: number;
  maxLength?: number;
}

type NarrowedArray<O extends Options, T> = O['length'] extends number
  ? Tuple<T, O['length']>
  : T[];

export function array<S extends Schema<unknown>, O extends Options>(
  schema: S,
  options: O,
): Schema<
  NarrowedArray<O, GetTypeFromSchema<S>>,
  NarrowedArray<O, GetTransformFromSchema<S>>
>;

export function array<S extends Schema<unknown>>(
  schema: S,
  options?: Options,
): Schema<GetTypeFromSchema<S>[], GetTransformFromSchema<S>[]>;

export function array<S extends Schema<unknown, U>, U>(
  schema: S,
  options?: Options,
): Schema<GetTypeFromSchema<S>[], GetTransformFromSchema<S>[]> {
  return new (class extends Schema<
    GetTypeFromSchema<S>[],
    GetTransformFromSchema<S>[]
  > {
    isType(v: unknown): v is GetTypeFromSchema<S>[] {
      if (!Array.isArray(v)) {
        return false;
      }
      let ok = options?.length === undefined || v.length === options.length;
      ok &&= options?.minLength === undefined || v.length >= options.minLength;
      ok &&= options?.maxLength === undefined || v.length <= options.maxLength;
      ok &&= v.every((v) => schema.isType(v));
      return ok;
    }

    transform(v: GetTypeFromSchema<S>[]): GetTransformFromSchema<S>[] {
      return v.map((v) => schema.transform(v)) as GetTransformFromSchema<S>[];
    }
  })();
}
