import { PrismaAdapter } from '@next-auth/prisma-adapter';
import db from 'gigbook/db';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Email({
      server: process.env.SMTP_URL,
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  // TODO: make custom auth pages
  pages: {},
});
