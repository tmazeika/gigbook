import prisma from 'gigbook/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const users = await prisma.user.findMany({
    where: {
      email: 'tj@mazeika.dev',
    },
    include: {
      clients: {
        include: {
          projects: true,
        },
      },
    },
  });
  res.status(200).json(users);
}
