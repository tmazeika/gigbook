import { Schema } from '.';

export function custom<T>(isType: (v: unknown) => T | undefined): Schema<T> {
  return new (class extends Schema<T> {
    isType(v: unknown): v is T {
      return isType(v) !== undefined;
    }

    transform(v: T): T {
      return v;
    }
  })();
}
