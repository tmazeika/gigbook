import { createContext } from 'react';

export interface Auth {
  user?: string;
}

export const context = createContext<Auth>({});
