import db, { isUniqueConstraintError } from 'gigbook/db';
import withAuth from 'gigbook/middleware/withAuth';
import withBody from 'gigbook/middleware/withBody';
import withMethods from 'gigbook/middleware/withMethods';
import { ApiHandler } from 'gigbook/models/apiResponse';
import {
  Client,
  clientSchema,
  clientSelect,
  fromDb,
} from 'gigbook/models/client';
import {
  sendCreated,
  sendError,
  sendJson,
  sendVoid,
} from 'gigbook/util/apiResponse';

const GET: ApiHandler<Client[]> = withAuth((user) => async (req, res) => {
  const dbClients = await db.client.findMany({
    select: clientSelect,
    where: { userId: user.id },
    orderBy: { name: 'asc' },
  });
  return sendJson(res, dbClients.map(fromDb));
});

const POST: ApiHandler<Client> = withAuth((user) =>
  withBody(clientSchema, (body) => async (req, res) => {
    try {
      const dbClient = await db.client.create({
        select: clientSelect,
        data: {
          ...body,
          id: undefined,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      return sendCreated(res, fromDb(dbClient), '/api/clients');
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        return sendError(res, 400, 'Client already exists');
      }
      throw err;
    }
  }),
);

const DELETE: ApiHandler = withAuth((user) => async (req, res) => {
  await db.client.deleteMany({
    where: { userId: user.id },
  });
  return sendVoid(res);
});

export default withMethods({ GET, POST, DELETE });
