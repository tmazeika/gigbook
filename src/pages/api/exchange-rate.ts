import withMethods from 'gigbook/middleware/withMethods';
import withQuery from 'gigbook/middleware/withQuery';
import { buildUrl } from 'gigbook/util/url';
import { NextApiResponse } from 'next';

interface WiseRate {
  rate: number;
}

export default withMethods(
  ['GET'],
  withQuery(
    ['from', 'to', 'date'],
    ({ from: source, to: target, date: time }) =>
      async (req, res: NextApiResponse<WiseRate>) => {
        const wiseRes = await fetch(
          buildUrl('https://api.transferwise.com', '/v1/rates', {
            source,
            target,
            time,
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
        const wiseJson = (await wiseRes.json()) as WiseRate[];
        res.status(200).json({
          rate: wiseJson[0].rate,
        });
      },
  ),
);
