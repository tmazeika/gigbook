import db, { createEntity, deleteEntity } from 'gigbook/db';
import withMethods from 'gigbook/middleware/withMethods';
import withUnsavedEntity from 'gigbook/middleware/withUnsavedEntity';
import withUser from 'gigbook/middleware/withUser';
import { isValidUnsavedClient } from 'gigbook/models/client';
import { User } from 'gigbook/models/user';
import type { NextApiHandler } from 'next';

function handler(user: User): NextApiHandler {
  const get: NextApiHandler = async (req, res) => {
    const { projects } = req.query;
    const clients = await db.client.findMany({
      where: {
        user: {
          email: user.email,
        },
      },
      include: {
        projects: projects === 'true',
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

  const _delete: NextApiHandler = async (req, res) => {
    const status = await deleteEntity(() =>
      db.client.deleteMany({
        where: {
          user: {
            email: user.email,
          },
        },
      }),
    );
    res.status(status).end();
  };

  return (req, res) => {
    switch (req.method) {
      case 'GET':
        return get(req, res);
      case 'POST':
        return post(req, res);
      case 'DELETE':
        return _delete(req, res);
    }
  };
}

export default withMethods(['GET', 'POST', 'DELETE'], withUser(handler));
