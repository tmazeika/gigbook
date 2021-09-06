import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

declare const global: NodeJS.Global & { prisma?: PrismaClient };
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}
export default prisma;

export function isUniqueConstraintError(err: unknown): boolean {
  return err instanceof PrismaClientKnownRequestError && err.code === 'P2002';
}
