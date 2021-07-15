import db from 'gigbook/db';
import withMethods from 'gigbook/middleware/withMethods';
import withUser from 'gigbook/middleware/withUser';
import { User } from 'gigbook/models/user';
import { getString } from 'gigbook/util/reqBody';
import { NextApiHandler } from 'next';

function handler(user: User): NextApiHandler {
  return async (req, res) => {
    if (req.method === 'GET') {
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
      res.status(200).json({
        value: dbUser.clockifyApiKey,
      });
    } else {
      const value = getString(req.body, 'value');
      if (value === undefined) {
        res.status(400).end();
        return;
      }
      const dbUser = await db.user.update({
        select: {
          clockifyApiKey: true,
        },
        where: {
          email: user.email,
        },
        data: {
          clockifyApiKey: value,
        },
      });
      res.status(200).json({
        value: dbUser.clockifyApiKey,
      });
    }
  };
}

export default withMethods(['GET', 'POST'], withUser(handler));
