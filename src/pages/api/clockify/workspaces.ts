import Clockify from 'gigbook/clockify/client';
import withClockify from 'gigbook/middleware/withClockify';
import withMethods from 'gigbook/middleware/withMethods';
import { NextApiHandler } from 'next';

function handler(clockify: Clockify): NextApiHandler {
  return async (req, res) => {
    const workspaces = await clockify.getWorkspaces();
    res.status(200).json(workspaces);
  };
}

export default withMethods(['GET'], withClockify(handler));
