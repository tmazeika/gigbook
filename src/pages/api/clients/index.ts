import db, { createEntity } from 'gigbook/db';
import withMethods from 'gigbook/middleware/withMethods';
import withUnsavedEntity from 'gigbook/middleware/withUnsavedEntity';
import withUser from 'gigbook/middleware/withUser';
import { isValidUnsavedClient } from 'gigbook/models/client';
import { User } from 'gigbook/models/user';
import type { NextApiHandler } from 'next';

function handler(user: User): NextApiHandler {
  const get: NextApiHandler = async (req, res) => {
    const clients = await db.client.findMany({
      where: {
        user: {
          email: user.email,
        },
      },
    });
    res.status(200).json(clients);
  };

  const post = withUnsavedEntity(
    isValidUnsavedClient,
    (client) => async (req, res) => {
      const status = await createEntity(() =>
        db.client.create({
          data: {
            name: client.name,
            user: {
              connect: {
                email: user.email,
              },
            },
          },
        }),
      );
      res.status(status).end();
    },
  );

  return (req, res) => (req.method === 'GET' ? get(req, res) : post(req, res));
}

export default withMethods(['GET', 'POST'], withUser(handler));
