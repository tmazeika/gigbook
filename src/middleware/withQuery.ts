import { NextApiHandler } from 'next';

export default function withQuery(
  key: string,
  options: {
    length?: number;
    minLength?: number;
    maxLength?: number;
  },
  next: (value: string) => NextApiHandler,
): NextApiHandler {
  return (req, res) => {
    const value = req.query[key];
    if (typeof value === 'string') {
      const exactLen = options.length;
      const minLen = options.minLength;
      const maxLen = options.maxLength;
      const len = value.length;
      if (
        (exactLen === undefined || len === exactLen) &&
        (minLen === undefined || len >= minLen) &&
        (maxLen === undefined || len <= maxLen)
      ) {
        return next(value)(req, res);
      }
    }
    res.status(400).end();
  };
}
