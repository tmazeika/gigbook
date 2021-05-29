import type { ReactNode } from 'react';
import type { Auth } from '../index';
import { context } from '../index';

export interface AuthProviderProps {
  children?: ReactNode;
}

export default function AuthProvider(props: AuthProviderProps): JSX.Element {
  return (
    <context.Provider value={useAuthProvider()}>
      {props.children}
    </context.Provider>
  );
}

function useAuthProvider(): Auth {
  return {
    user: undefined,
  };
}
