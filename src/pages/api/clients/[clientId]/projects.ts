import db, { createEntity, deleteEntity } from 'gigbook/db';
import withMethods from 'gigbook/middleware/withMethods';
import withUnsavedEntity from 'gigbook/middleware/withUnsavedEntity';
import withUser from 'gigbook/middleware/withUser';
import { isValidUnsavedProject } from 'gigbook/models/project';
import type { NextApiHandler } from 'next';

function handler(): NextApiHandler {
  const get: NextApiHandler = async (req, res) => {
    const clientId = req.query.clientId as string;
    const projects = await db.project.findMany({
      where: {
        clientId: Number(clientId),
      },
    });
    res.status(200).json(projects);
  };

  const post = withUnsavedEntity(
    isValidUnsavedProject,
    (client) => async (req, res) => {
      const clientId = req.query.clientId as string;
      const status = await createEntity(() =>
        db.project.create({
          data: {
            name: client.name,
            clientId: Number(clientId),
          },
        }),
      );
      res.status(status).end();
    },
  );

  const _delete: NextApiHandler = async (req, res) => {
    const clientId = req.query.clientId as string;
    const status = await deleteEntity(() =>
      db.project.deleteMany({
        where: {
          clientId: Number(clientId),
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
