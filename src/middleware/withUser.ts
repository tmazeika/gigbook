import { User } from 'gigbook/models/user';
import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

export default function withUser(
  next: (user: User) => NextApiHandler,
): NextApiHandler {
  return async (req, res) => {
    const session = await getSession({ req });
    if (session) {
      return next({
        name: session.user?.name ?? undefined,
        email: session.user?.email ?? undefined,
      })(req, res);
    }
    res.status(403).end();
  };
}
