import db from 'gigbook/db';
import withMethods from 'gigbook/middleware/withMethods';
import withUser from 'gigbook/middleware/withUser';
import { User } from 'gigbook/models/user';
import { NextApiHandler } from 'next';

function handler(user: User): NextApiHandler {
  return async (req, res) => {
    const dbUser = await db.user.findFirst({
      where: {
        email: user.email,
      },
      select: {
        clockifyApiKey: true,
      },
    });
    if (!dbUser) {
      return res.status(404).end();
    }
    if (!dbUser.clockifyApiKey) {
      return res.status(204).end();
    }
    res.status(200).json({
      apiKey: dbUser.clockifyApiKey,
    });
  };
}

export default withMethods(['GET'], withUser(handler));
