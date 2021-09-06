import { decode } from 'gigbook/json';

export const extFetcher = (resource: RequestInfo, init?: RequestInit) =>
  fetch(resource, init).then(async (res) => {
    if (res.status === 204) {
      return undefined;
    }
    const body: unknown = decode(await res.text());
    if (!res.ok) {
      throw body;
    }
    return body;
  });

export function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError';
}
