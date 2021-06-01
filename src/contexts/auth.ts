import { createContext } from 'react';

export interface Auth {
  register(email: string, password: string): Promise<void>;

  signIn(email: string, password: string): Promise<void>;

  signOut(): Promise<void>;
}

export default createContext<Auth>({
  register() {
    throw 'NYI';
  },
  signIn() {
    throw 'NYI';
  },
  signOut() {
    throw 'NYI';
  },
});
