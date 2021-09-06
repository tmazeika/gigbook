import * as nextAuth from 'next-auth';

declare module 'next-auth' {
  interface User extends nextAuth.User {
    id: string;
  }

  interface Session {
    user: User;
  }
}
