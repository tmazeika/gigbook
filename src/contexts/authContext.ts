import { createContext } from 'react';
import type { User } from '../models';

export interface Auth {
  user?: User;

  register(email: string, password: string): Promise<void>;

  signIn(email: string, password: string): Promise<void>;

  signOut(): Promise<void>;
}

export default createContext<Auth>({
  register() {
    throw new Error();
  },
  signIn() {
    throw new Error();
  },
  signOut() {
    throw new Error();
  },
});
