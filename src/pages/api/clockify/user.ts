import Clockify from 'gigbook/clockify/client';
import withClockify from 'gigbook/middleware/withClockify';
import withMethods from 'gigbook/middleware/withMethods';
import { NextApiHandler } from 'next';

function handler(clockify: Clockify): NextApiHandler {
  return async (req, res) => {
    const user = await clockify.getUser();
    res.status(200).json(user);
  };
}

export default withMethods(['GET'], withClockify(handler));
