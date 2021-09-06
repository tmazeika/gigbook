import withAuth from 'gigbook/middleware/withAuth';
import withMethods from 'gigbook/middleware/withMethods';
import withQuery from 'gigbook/middleware/withQuery';
import { ApiHandler } from 'gigbook/models/apiResponse';
import { currencies, Currency } from 'gigbook/models/currency';
import { sendError, sendJson } from 'gigbook/util/apiResponse';
import { buildUrl } from 'gigbook/util/url';
import { DateTime } from 'luxon';

const fetchInit: RequestInit = {
  headers: {
    Authorization: `Bearer ${String(process.env.WISE_API_KEY)}`,
  },
};

const genericErrorMessage = 'Error requesting exchange rate';

// TODO: maybe make these use schemas

function checkFromTo(from: string, to: string): string | null {
  if (!currencies.includes(from as Currency)) {
    return 'Invalid "from" currency';
  }
  if (!currencies.includes(to as Currency)) {
    return 'Invalid "to" currency';
  }
  return null;
}

function checkAt(at: string): string | null {
  const parsedAt = DateTime.fromISO(at);
  if (!parsedAt.isValid) {
    return 'Invalid date';
  }
  if (parsedAt > DateTime.now()) {
    return 'Date is in the future';
  }
  return null;
}

const GET: ApiHandler<number> = withQuery(
  ['from', 'to', 'at'],
  (query) => async (req, res) => {
    const invalidFromTo = checkFromTo(query.from, query.to);
    if (invalidFromTo) {
      return sendError(res, 400, invalidFromTo);
    }
    const invalidAt = checkAt(query.at);
    if (invalidAt) {
      return sendError(res, 400, invalidAt);
    }
    if (query.from === query.to) {
      return sendJson(res, 1);
    }
    const wiseRes = await fetch(
      buildUrl('https://api.transferwise.com/v1/rates', {
        source: query.from,
        target: query.to,
        time: query.at,
      }),
      fetchInit,
    );
    if (!wiseRes.ok) {
      return sendError(res, 500, genericErrorMessage);
    }
    const wiseBody = (await wiseRes.json()) as { rate: number }[];
    if (wiseBody.length === 0) {
      return sendError(res, 500, genericErrorMessage);
    }
    return sendJson(res, wiseBody[0].rate);
  },
);

export default withAuth(() => withMethods({ GET }));
