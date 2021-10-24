import { Prisma } from '@prisma/client';
import ClockifyApiClient from 'gigbook/clockify/client';
import db from 'gigbook/db';
import withAuth from 'gigbook/middleware/withAuth';
import withBody from 'gigbook/middleware/withBody';
import withMethods from 'gigbook/middleware/withMethods';
import { ApiHandler } from 'gigbook/models/apiResponse';
import { User, userSchema } from 'gigbook/models/user';
import { sendError, sendJson } from 'gigbook/util/apiResponse';

const userSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  clockifyApiKey: true,
  payeeName: true,
  payeeAddress: true,
  payeeDescription: true,
});

const GET: ApiHandler<User> = withAuth((user) => async (req, res) => {
  if (String(req.query['userId']) !== user.id) {
    return sendError(res, 404, 'User not found');
  }
  const dbUser = await db.user.findUnique({
    select: userSelect,
    where: { id: user.id },
  });
  if (dbUser === null) {
    return sendError(res, 404, 'User not found');
  }
  return sendJson(res, dbUser);
});

const PATCH: ApiHandler<User> = withAuth((user) =>
  withBody(userSchema.partial(), (body) => async (req, res) => {
    if (String(req.query['userId']) !== user.id) {
      return sendError(res, 404, 'User not found');
    }
    if (body.clockifyApiKey !== null) {
      if (!(await new ClockifyApiClient(body.clockifyApiKey).isValid())) {
        return sendError(res, 400, 'Invalid Clockify API key');
      }
    }
    const dbUser = await db.user.update({
      select: userSelect,
      data: { ...body, id: undefined },
      where: { id: user.id },
    });
    if (dbUser === null) {
      return sendError(res, 404, 'User not found');
    }
    return sendJson(res, dbUser);
  }),
);

export default withMethods({ GET, PATCH });
