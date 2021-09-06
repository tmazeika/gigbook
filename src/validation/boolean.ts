import { Schema } from '.';

export function boolean(): Schema<boolean> {
  return new (class extends Schema<boolean> {
    isType(v: unknown): v is boolean {
      return typeof v === 'boolean';
    }

    transform(v: boolean): boolean {
      return v;
    }
  })();
}
