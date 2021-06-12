export interface UnsavedClient {
  name: string;
}

export interface Client extends UnsavedClient {
  id: number;
}

export function isValidUnsavedClient(v: unknown): v is UnsavedClient {
  return isUnsavedClient(v) && isValid(v);
}

function isUnsavedClient(v: unknown): v is UnsavedClient {
  return typeof (v as UnsavedClient)?.name === 'string';
}

function isValid({ name }: UnsavedClient): boolean {
  return 1 <= name.length && name.length <= 255;
}
