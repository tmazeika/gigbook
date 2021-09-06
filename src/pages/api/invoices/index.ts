import cuid from 'cuid';
import db, { isUniqueConstraintError } from 'gigbook/db';
import withAuth from 'gigbook/middleware/withAuth';
import withBody from 'gigbook/middleware/withBody';
import withMethods from 'gigbook/middleware/withMethods';
import { ApiHandler } from 'gigbook/models/apiResponse';
import {
  createInvoice,
  fromDb,
  Invoice,
  invoiceSchema,
  invoiceSelect,
} from 'gigbook/models/invoice';
import { sendCreated, sendError, sendJson } from 'gigbook/util/apiResponse';

const GET: ApiHandler<Invoice[]> = withAuth((user) => async (req, res) => {
  const dbInvoices = await db.invoice.findMany({
    select: invoiceSelect,
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  return sendJson(res, dbInvoices.map(fromDb));
});

const POST: ApiHandler<Invoice> = withAuth((user) =>
  withBody(invoiceSchema, (body) => async (req, res) => {
    const id = cuid();
    try {
      await db.user.update({
        select: null,
        data: createInvoice(id, user.id, body),
        where: { id: user.id },
      });
      return sendCreated(res, { ...body, id }, '/api/invoices');
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        return sendError(res, 400, 'Invoice already exists');
      }
      throw err;
    }
  }),
);

export default withMethods({ GET, POST });
