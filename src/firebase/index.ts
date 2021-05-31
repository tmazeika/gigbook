import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, useAuthEmulator } from 'firebase/auth';
import { getFirestore, useFirestoreEmulator } from 'firebase/firestore';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length
  ? getApp()
  : (() => {
      const app = initializeApp(config);
      if (process.env.NODE_ENV !== 'production') {
        useAuthEmulator(getAuth(app), 'http://localhost:9099', {
          disableWarnings: true,
        });
        useFirestoreEmulator(getFirestore(app), 'localhost', 8080);
      }
      return app;
    })();
export const auth = getAuth(app);
export const db = getFirestore(app);
