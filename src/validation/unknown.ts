import { Schema } from '.';

export function unknown(): Schema<unknown> {
  return new (class extends Schema<unknown> {
    isType(v: unknown): v is unknown {
      return true;
    }

    transform(v: unknown): unknown {
      return v;
    }
  })();
}
