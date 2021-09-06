import db from 'gigbook/db';
import withAuth from 'gigbook/middleware/withAuth';
import withMethods from 'gigbook/middleware/withMethods';
import { ApiHandler } from 'gigbook/models/apiResponse';
import { fromDb, Invoice, invoiceSelect } from 'gigbook/models/invoice';
import { sendError, sendJson } from 'gigbook/util/apiResponse';

const GET: ApiHandler<Invoice> = withAuth((user) => async (req, res) => {
  const dbInvoice = await db.invoice.findFirst({
    select: invoiceSelect,
    where: {
      id: String(req.query['invoiceId']),
      userId: user.id,
    },
  });
  if (dbInvoice === null) {
    return sendError(res, 404, 'Invoice not found');
  }
  return sendJson(res, fromDb(dbInvoice));
});

export default withMethods({ GET });
