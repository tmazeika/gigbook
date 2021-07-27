export function buildUrl(
  base: string,
  path: string,
  query?: Record<string, unknown>,
): string {
  const url = new URL(path, base);
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
