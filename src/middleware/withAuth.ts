import { ApiHandler } from 'gigbook/models/apiResponse';
import { sendError } from 'gigbook/util/apiResponse';
import { User } from 'next-auth';
import { getSession } from 'next-auth/client';

export default function withAuth<R>(
  next: (user: User) => ApiHandler<R>,
): ApiHandler<R> {
  return async (req, res) => {
    const session = await getSession({ req });
    if (session) {
      return next(session.user)(req, res);
    }
    sendError(res, 403, 'Login required');
  };
}
