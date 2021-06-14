import withMethods from 'gigbook/middleware/withMethods';
import withQuery from 'gigbook/middleware/withQuery';
import { buildUrl } from 'gigbook/util/url';

interface WiseRate {
  rate: number;
}

export default withMethods(
  ['GET'],
  withQuery('from', { length: 3 }, (source) =>
    withQuery('to', { length: 3 }, (target) => async (req, res) => {
      const wiseRes = await fetch(
        buildUrl('https://api.transferwise.com', '/v1/rates', {
          source,
          target,
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
        exchangeRate: wiseJson[0].rate,
      });
    }),
  ),
);
