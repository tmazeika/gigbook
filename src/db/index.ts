import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';

interface PrismaNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

declare const global: PrismaNodeJsGlobal;

export default (() =>
  process.env.NODE_ENV === 'production'
    ? new PrismaClient()
    : (global.prisma ||= new PrismaClient()))();

export async function createEntity(
  fn: () => Promise<unknown>,
): Promise<number> {
  return execute(fn, 201);
}

export async function deleteEntity(
  fn: () => Promise<unknown>,
): Promise<number> {
  return execute(fn, 204);
}

async function execute(
  fn: () => Promise<unknown>,
  ok: number,
): Promise<number> {
  try {
    await fn();
    return ok;
  } catch (e) {
    console.error(e);
    return isClientError(e) ? 400 : 500;
  }
}

function isClientError(
  e: unknown,
): e is PrismaClientKnownRequestError | PrismaClientValidationError {
  return (
    e instanceof PrismaClientKnownRequestError ||
    e instanceof PrismaClientValidationError
  );
}
