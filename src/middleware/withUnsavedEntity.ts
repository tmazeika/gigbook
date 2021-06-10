import { NextApiHandler } from 'next';

export default function withUnsavedEntity<T>(
  isValid: (input: unknown) => input is T,
  next: (entity: T) => NextApiHandler,
): NextApiHandler {
  return async (req, res) => {
    const input: unknown = req.body;
    if (isValid(input)) {
      return next(input)(req, res);
    }
    res.status(400).end();
  };
}
