export * from './array';
export * from './boolean';
export * from './custom';
export * from './number';
export * from './object';
export * from './string';
export * from './unknown';

export type GetTypeFromSchema<S> = S extends Schema<infer T, unknown>
  ? T
  : never;

export type GetTransformFromSchema<S> = S extends Schema<unknown, infer U>
  ? U
  : never;

export abstract class Schema<T, U = T> {
  abstract isType(v: unknown): v is T;

  abstract transform(v: T): U;

  validateAndTransform(v: unknown): U | undefined {
    if (this.isType(v)) {
      return this.transform(v);
    }
  }

  withValidator(fn: (v: T) => boolean): Schema<T, U> {
    const t = this;
    return new (class extends Schema<T, U> {
      isType(v: unknown): v is T {
        return t.isType(v) && fn(v);
      }

      transform(v: T): U {
        return t.transform(v);
      }
    })();
  }

  withTransform<V>(fn: (v: U) => V): Schema<T, V> {
    const t = this;
    return new (class extends Schema<T, V> {
      isType(v: unknown): v is T {
        return t.isType(v);
      }

      transform(v: T): V {
        return fn(t.transform(v));
      }
    })();
  }

  optional(): Schema<T | undefined, U | undefined> {
    const t = this;
    return new (class extends Schema<T | undefined, U | undefined> {
      isType(v: unknown): v is T | undefined {
        return v === undefined || t.isType(v);
      }

      transform(v: T | undefined): U | undefined {
        return v === undefined ? undefined : t.transform(v);
      }
    })();
  }

  nullable(): Schema<T | null, U | null> {
    const t = this;
    return new (class extends Schema<T | null, U | null> {
      isType(v: unknown): v is T | null {
        return v === null || t.isType(v);
      }

      transform(v: T | null): U | null {
        return v === null ? null : t.transform(v);
      }
    })();
  }

  or<S extends Schema<unknown, V>, V>(
    schema: S,
  ): Schema<T | GetTypeFromSchema<S>, U | V> {
    const t = this;
    return new (class extends Schema<T | GetTypeFromSchema<S>, U | V> {
      isType(v: unknown): v is T | GetTypeFromSchema<S> {
        return t.isType(v) || schema.isType(v);
      }

      transform<S>(v: GetTypeFromSchema<S> | T): U | V {
        return t.isType(v) ? t.transform(v) : schema.transform(v);
      }
    })();
  }
}

export type SchemaRecord = Record<PropertyKey, Schema<unknown>>;

export type GetTypeFromSchemaRecord<S extends SchemaRecord> = {
  [K in keyof S]: GetTypeFromSchema<S[K]>;
};

export type GetTransformFromSchemaRecord<S extends SchemaRecord> = {
  [K in keyof S]: GetTransformFromSchema<S[K]>;
};

export abstract class ObjectSchema<S extends SchemaRecord> extends Schema<
  GetTypeFromSchemaRecord<S>,
  GetTransformFromSchemaRecord<S>
> {
  abstract partial(): Schema<
    Partial<GetTypeFromSchemaRecord<S>>,
    Partial<GetTransformFromSchemaRecord<S>>
  >;
}
