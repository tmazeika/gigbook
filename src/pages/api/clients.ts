import type { NextApiRequest, NextApiResponse } from 'next';

import 'reflect-metadata';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): void {
  res.status(200).end();
}
