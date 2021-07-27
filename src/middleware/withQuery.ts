import { NextApiHandler } from 'next';

export default function withQuery<T>(
  params: (keyof T)[],
  next: (args: Record<keyof T, string>) => NextApiHandler,
): NextApiHandler {
  return (req, res) => {
    const args = Object.fromEntries(
      params.map((p) => [p, req.query[p as string]]),
    );
    if (Object.values(args).some((v) => typeof v !== 'string')) {
      return res.status(400).end();
    }
    return next(args as Record<keyof T, string>)(req, res);
  };
}
