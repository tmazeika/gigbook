export function buildUrl(
  base: string,
  path: string,
  query: Record<string, unknown> = {},
): string {
  const url = new URL(path, base);

  Object.entries(query)
    .flatMap<[string, unknown]>(([k, v]) =>
      Array.isArray(v) ? v.map<[string, unknown]>((v) => [k, v]) : [[k, v]],
    )
    .forEach(([k, v]) => url.searchParams.append(k, String(v)));

  return url.toString();
}
