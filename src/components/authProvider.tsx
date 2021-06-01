import type { Auth } from 'gigbook/contexts/auth';
import AuthContext from 'gigbook/contexts/auth';
import type { ReactNode } from 'react';

export interface AuthProviderProps {
  children?: ReactNode;
}

export default function AuthProvider(props: AuthProviderProps): JSX.Element {
  return (
    <AuthContext.Provider value={useAuthProvider()}>
      {props.children}
    </AuthContext.Provider>
  );
}

function useAuthProvider(): Auth {
  return {
    register(email: string, password: string): Promise<void> {
      throw 'NYI';
    },
    signIn(email: string, password: string): Promise<void> {
      throw 'NYI';
    },
    signOut(): Promise<void> {
      throw 'NYI';
    },
  };
}
