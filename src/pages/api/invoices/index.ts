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
      const user = await db.user.findFirst({
        select: {
          id: true,
        },
        where: {
          email: userEmail,
        },
      });
      if (user === null) {
        return res.status(403).end();
      }
      const code = await createEntity(() =>
        db.user.update({
          where: {
            email: userEmail,
          },
          data: {
            invoices: {
              create: toDb(invoice),
            },
            clients: {
              upsert: {
                where: {
                  userId_name: {
                    userId: user.id,
                    name: invoice.client.name,
                  },
                },
                update: {},
                create: {
                  name: invoice.client.name,
                  currency: invoice.client.currency,
                  address: invoice.client.address,
                },
              },
            },
          },
        }),
      );
      res.status(code).end();
    }
  }),
);
