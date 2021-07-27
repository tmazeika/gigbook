import db, { createEntity } from 'gigbook/db';
import withMethods from 'gigbook/middleware/withMethods';
import withUser from 'gigbook/middleware/withUser';
import { fromBody, toDb } from 'gigbook/models/invoice';

export default withMethods(
  ['POST'],
  withUser((user) => async (req, res) => {
    const userEmail = user.email;
    if (!userEmail) {
      return res.status(403).end();
    }
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
  }),
);
