import Clockify, { ClockifyError } from 'gigbook/clockify/client';
import type { NextApiHandler } from 'next';

export default function withClockify(
  next: (clockify: Clockify) => NextApiHandler,
): NextApiHandler {
  return async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (typeof apiKey === 'string') {
      try {
        return await next(new Clockify(apiKey))(req, res);
      } catch (e) {
        if (e instanceof ClockifyError && !res.headersSent) {
          return res.status(e.status).end();
        }
        throw e;
      }
    }
    res.status(400).end();
  };
}
