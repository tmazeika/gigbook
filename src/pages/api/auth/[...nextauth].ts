import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from 'gigbook/db';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default NextAuth({
  providers: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    Providers.Email({
      server: process.env.SMTP_URL,
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: PrismaAdapter(prisma),
});
