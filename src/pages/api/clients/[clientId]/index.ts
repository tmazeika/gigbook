import db from 'gigbook/db';
import withMethods from 'gigbook/middleware/withMethods';
import withQuery from 'gigbook/middleware/withQuery';
import withUser from 'gigbook/middleware/withUser';
import { User } from 'gigbook/models/user';
import type { NextApiHandler } from 'next';

function handler(user: User, clientId: string): NextApiHandler {
  return async (req, res) => {
    const client = await db.client.findFirst({
      where: {
        clockifyId: clientId,
      },
    });
    res.status(200).json(client);
  };
}

export default withMethods(
  ['GET'],
  withUser((user) =>
    withQuery('clientId', {}, (clientId) => handler(user, clientId)),
  ),
);
