import db from 'gigbook/db';
import withAuth from 'gigbook/middleware/withAuth';
import withMethods from 'gigbook/middleware/withMethods';
import { ApiHandler } from 'gigbook/models/apiResponse';
import { Currency } from 'gigbook/models/currency';
import {
  InvoicePrefill,
  invoicePrefillSelect,
} from 'gigbook/models/invoicePrefill';
import { sendError, sendJson } from 'gigbook/util/apiResponse';

const GET: ApiHandler<InvoicePrefill> = withAuth((user) => async (req, res) => {
  const dbUser = await db.user.findFirst({
    select: invoicePrefillSelect,
    where: { id: user.id },
  });
  if (dbUser === null) {
    return sendError(res, 404, 'User not found');
  }
  const dbInvoice = dbUser.invoices[0];
  return sendJson(res, {
    ...dbInvoice,
    payeeName: dbUser.payeeName ?? dbInvoice?.payeeName,
    payeeDescription: dbUser.payeeDescription ?? dbInvoice?.payeeDescription,
    payeeAddress: dbUser.payeeAddress ?? dbInvoice?.payeeAddress,
    clientCurrency: dbInvoice?.clientCurrency as Currency,
    billingCurrency: dbInvoice?.billingCurrency as Currency,
  });
});

export default withMethods({ GET });
