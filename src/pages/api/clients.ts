import prisma from 'gigbook/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const session = await getSession({ req });
  if (session) {
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
  } else {
    res.status(401);
  }
  res.end();
}
