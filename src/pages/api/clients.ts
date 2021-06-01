import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const prisma = new PrismaClient();

  try {
    const allClients = await prisma.client.findMany();
    res.status(200).json(allClients);
  } finally {
    await prisma.$disconnect();
  }
}
