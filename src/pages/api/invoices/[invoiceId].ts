import db from 'gigbook/db';
import withMethods from 'gigbook/middleware/withMethods';
import withUser from 'gigbook/middleware/withUser';
import { ApiError } from 'gigbook/models/apiError';
import { fromDb, toBody } from 'gigbook/models/invoice';
import { NextApiResponse } from 'next';

type Response = NextApiResponse<ReturnType<typeof toBody> | ApiError>;

export default withMethods(
  ['GET'],
  withUser((user) => async (req, res: Response) => {
    const userEmail = user.email;
    if (!userEmail) {
      return res.status(403).json({ message: 'User email not found' });
    }
    const invoiceId = Number(req.query['invoiceId']);
    if (!Number.isSafeInteger(invoiceId)) {
      return res.status(400).json({ message: 'Invalid invoice ID' });
    }
    const invoice = await db.invoice.findFirst({
      include: {
        lineItems: true,
      },
      where: {
        id: invoiceId,
        user: {
          email: userEmail,
        },
      },
    });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    return res.status(200).json(toBody(fromDb(invoice)));
  }),
);
