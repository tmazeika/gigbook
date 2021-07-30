import db, { createEntity } from 'gigbook/db';
import withMethods from 'gigbook/middleware/withMethods';
import withUser from 'gigbook/middleware/withUser';
import { fromBody, fromDb, toBody, toDb } from 'gigbook/models/invoice';

export default withMethods(
  ['GET', 'POST'],
  withUser((user) => async (req, res) => {
    const userEmail = user.email;
    if (!userEmail) {
      return res.status(403).end();
    }
    if (req.method === 'GET') {
      const invoices = await db.invoice.findMany({
        include: {
          lineItems: true,
        },
        where: {
          user: {
            email: userEmail,
          },
        },
      });
      res.status(200).json(invoices.map((i) => toBody(fromDb(i))));
    } else {
      const invoice = fromBody(req.body);
      if (!invoice) {
        return res.status(400).end();
      }
      const code = await createEntity(() =>
        db.invoice.create({
          data: toDb(invoice, userEmail),
        }),
      );
      res.status(code).end();
    }
  }),
);
