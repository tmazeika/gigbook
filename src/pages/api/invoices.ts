import withMethods from 'gigbook/middleware/withMethods';
import { Invoice, invoiceSchema } from 'gigbook/models/invoice';
import Mustache from 'mustache';

export default withMethods(['POST'], async (req, res) => {
  let invoice: Invoice;
  try {
    invoice = await invoiceSchema.validate(req.body, {
      stripUnknown: true,
    });
  } catch (e) {
    res.status(400).end();
    return;
  }
  const result = Mustache.render(invoice.template, {
    ...invoice,
    template: undefined,
  });
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(result);
});
