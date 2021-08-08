import db from 'gigbook/db';
import withMethods from 'gigbook/middleware/withMethods';
import withUser from 'gigbook/middleware/withUser';
import { ApiError } from 'gigbook/models/apiError';
import { User } from 'gigbook/models/user';
import { NextApiHandler } from 'next';

export interface InvoicePrefillResponse {
  payeeName?: string;
  payeeDescription?: string;
  payeeAddress?: string;
  clientName?: string;
  clientAddress?: string;
  clientCurrency?: string;
  billingIncrement?: number;
  billingNetTerms?: number;
  billingCurrency?: string;
}

type Response = InvoicePrefillResponse | ApiError;

function handle(authUser: User): NextApiHandler<Response> {
  return async (req, res) => {
    const user = await db.user.findFirst({
      where: {
        email: authUser.email,
      },
      select: {
        payeeName: true,
        payeeDescription: true,
        payeeAddress: true,
        invoices: {
          select: {
            payeeName: true,
            payeeDescription: true,
            payeeAddress: true,
            clientName: true,
            clientAddress: true,
            clientCurrency: true,
            billingIncrement: true,
            billingNetTerms: true,
            billingCurrency: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
    if (user === null) {
      return res.status(404).json({ message: 'User not found' });
    }
    const invoice = user.invoices[0];
    res.status(200).json({
      payeeName: user.payeeName ?? invoice?.payeeName,
      payeeDescription: user.payeeDescription ?? invoice?.payeeDescription,
      payeeAddress: user.payeeAddress ?? invoice?.payeeAddress,
      clientName: invoice?.clientName,
      clientAddress: invoice?.clientAddress,
      clientCurrency: invoice?.clientCurrency,
      billingIncrement: invoice?.billingIncrement,
      billingNetTerms: invoice?.billingNetTerms,
      billingCurrency: invoice?.billingCurrency,
    });
  };
}

export default withMethods(['GET'], withUser(handle));
