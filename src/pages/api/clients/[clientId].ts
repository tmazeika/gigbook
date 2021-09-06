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
import { sendError, sendJson, sendVoid } from 'gigbook/util/apiResponse';

const GET: ApiHandler<Client> = withAuth((user) => async (req, res) => {
  const dbClient = await db.client.findFirst({
    select: clientSelect,
    where: {
      id: String(req.query['clientId']),
      userId: user.id,
    },
  });
  if (dbClient === null) {
    return sendError(res, 404, 'Client not found');
  }
  return sendJson(res, fromDb(dbClient));
});

const PATCH: ApiHandler = withAuth((user) =>
  withBody(clientSchema.partial(), (body) => async (req, res) => {
    try {
      const { count } = await db.client.updateMany({
        data: { ...body, id: undefined },
        where: {
          id: String(req.query['clientId']),
          userId: user.id,
        },
      });
      if (count === 0) {
        return sendError(res, 404, 'Client not found');
      }
      return sendVoid(res);
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        return sendError(res, 400, 'Client already exists');
      }
      throw err;
    }
  }),
);

const DELETE: ApiHandler = withAuth((user) => async (req, res) => {
  const { count } = await db.client.deleteMany({
    where: {
      id: String(req.query['clientId']),
      userId: user.id,
    },
  });
  if (count === 0) {
    return sendError(res, 404, 'Client not found');
  }
  return sendVoid(res);
});

export default withMethods({ GET, PATCH, DELETE });
