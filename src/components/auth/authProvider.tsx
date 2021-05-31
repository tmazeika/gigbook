import type { User as FirebaseUser } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { Auth } from '../../contexts/authContext';
import AuthContext from '../../contexts/authContext';
import { auth } from '../../firebase';
import type { User } from '../../models';

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
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user ? fromFirebase(user) : undefined);
      },
      console.error,
    );
    return () => unsubscribe();
  }, []);

  return {
    user,
    async register(email: string, password: string) {
      await createUserWithEmailAndPassword(auth, email, password);
    },
    async signIn(email: string, password: string) {
      await signInWithEmailAndPassword(auth, email, password);
    },
    async signOut() {
      await signOut(auth);
    },
  };
}

function fromFirebase(user: FirebaseUser): User {
  return {
    id: user.uid,
    email: user.email ?? undefined,
    verified: user.emailVerified,
  };
}
