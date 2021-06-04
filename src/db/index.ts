import { PrismaClient } from '@prisma/client';

interface PrismaNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

declare const global: PrismaNodeJsGlobal;

export default (() =>
  process.env.NODE_ENV === 'production'
    ? new PrismaClient()
    : (global.prisma ||= new PrismaClient()))();
