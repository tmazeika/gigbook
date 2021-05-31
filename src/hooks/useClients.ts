import type { QueryDocumentSnapshot } from 'firebase/firestore';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  writeBatch,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import type { Client } from '../models';
import useAuth from './useAuth';

export interface Clients {
  data?: Client[];

  create(name: string): Promise<void>;

  update(id: string, name: string): Promise<void>;

  delete(id: string, name: string): Promise<void>;
}

export default function useClients(): Clients {
  const [clients, setClients] = useState<Client[]>();
  const userId = useAuth().user?.id;

  useEffect(() => {
    if (userId) {
      const unsubscribe = onSnapshot(
        query(collection(db, 'users', userId, 'clients'), orderBy('name')),
        ({ docs }) => setClients(docs.map(fromFirebase)),
        console.error,
      );
      return () => unsubscribe();
    }
  }, [userId]);

  return {
    data: clients,
    async create(name: string) {
      if (!userId) {
        throw 'Not authenticated';
      }
      const userRef = doc(db, 'users', userId);
      const clientRef = doc(collection(db, 'users', userId, 'clients'));
      const batch = writeBatch(db);
      batch.set(
        userRef,
        {
          clients: arrayUnion(name),
        },
        { merge: true },
      );
      batch.set(clientRef, { name });
      await batch.commit();
    },
    async update(id: string, name: string) {
      if (!userId) {
        throw 'Not authenticated';
      }
      const userRef = doc(db, 'users', userId);
      const clientRef = doc(db, 'users', userId, 'clients', id);
      await runTransaction(db, async (txn) => {
        const clientSnapshot = await txn.get(clientRef);
        if (!clientSnapshot.exists()) {
          throw "Client doesn't exist";
        }
        const client = fromFirebase(clientSnapshot);
        if (name !== client.name) {
          txn.update(userRef, {
            clients: arrayRemove(client.name),
          });
          txn.update(userRef, {
            clients: arrayUnion(name),
          });
          txn.set(clientRef, { name }, { merge: true });
        }
      });
    },
    async delete(id: string, name: string) {
      if (!userId) {
        throw 'Not authenticated';
      }
      const userRef = doc(db, 'users', userId);
      const clientRef = doc(db, 'users', userId, 'clients', id);
      const batch = writeBatch(db);
      batch.update(userRef, {
        clients: arrayRemove(name),
      });
      batch.delete(clientRef);
      await batch.commit();
    },
  };
}

function fromFirebase(doc: QueryDocumentSnapshot): Client {
  return {
    id: doc.id,
    name: String(doc.data().name),
  };
}
