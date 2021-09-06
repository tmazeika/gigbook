export function joinPaths(...parts: string[]): string {
  return `/${parts.map(encodeURIComponent).join('/')}`;
}

export function urlEnc(collection: string, resource: string): string {
  return `${collection}/${encodeURIComponent(resource)}`;
}

export function buildUrl(
  path: string,
  query?: Record<string, unknown>,
): string {
  const url = new URL(path);
  buildSearchParams(query, url.searchParams);
  return url.toString();
}

export function buildRelUrl(
  path: string,
  query?: Record<string, unknown>,
): string {
  return `${path}${query ? '?' : ''}${buildSearchParams(query).toString()}`;
}

function buildSearchParams(
  query: Record<string, unknown> = {},
  searchParams: URLSearchParams = new URLSearchParams(),
): URLSearchParams {
  Object.entries(query)
    .flatMap<[string, unknown]>(([k, v]) =>
      Array.isArray(v) ? v.map<[string, unknown]>((v) => [k, v]) : [[k, v]],
    )
    .forEach(([k, v]) => searchParams.append(k, String(v)));
  return searchParams;
}
