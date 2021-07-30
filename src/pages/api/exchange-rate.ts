import withMethods from 'gigbook/middleware/withMethods';
import withQuery from 'gigbook/middleware/withQuery';
import { buildUrl } from 'gigbook/util/url';
import { NextApiHandler } from 'next';

export interface ExchangeRateResponse {
  rate: number;
}

interface HandleParams {
  from: string;
  to: string;
  date: string;
}

function handle(params: HandleParams): NextApiHandler<ExchangeRateResponse> {
  return async (req, res) => {
    const wiseRes = await fetch(
      buildUrl('https://api.transferwise.com', '/v1/rates', {
        source: params.from,
        target: params.to,
        time: params.date,
      }),
      {
        headers: {
          Authorization: `Bearer ${String(process.env.WISE_API_KEY)}`,
        },
      },
    );
    if (!wiseRes.ok) {
      return res.status(wiseRes.status).end();
    }
    const wiseBody = (await wiseRes.json()) as ExchangeRateResponse[];
    res.status(200).json({
      rate: wiseBody[0].rate,
    });
  };
}

export default withMethods(['GET'], withQuery(['from', 'to', 'date'], handle));
