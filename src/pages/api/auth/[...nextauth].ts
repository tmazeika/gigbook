import { PrismaAdapter } from '@next-auth/prisma-adapter';
import db from 'gigbook/db';
import NextAuth, { Session, User } from 'next-auth';
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
  callbacks: {
    async session(session: Session, user: User): Promise<Session> {
      session.user.id = user.id;
      return session;
    },
  },
  // TODO: make custom auth pages
  pages: {},
});
