import { signIn, signOut, useSession } from 'next-auth/client';
import Head from 'next/head';
import React from 'react';
import styles from './layout.module.css';

export default function Layout(
  props: React.PropsWithChildren<unknown>,
): JSX.Element {
  const [session] = useSession();

  return (
    <div className={styles.layout}>
      <Head>
        <title>GigBook</title>
      </Head>
      <header>
        {!session && (
          <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
          </>
        )}
        {session && (
          <>
            Signed in as <strong>{session.user?.email}</strong> <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )}
      </header>
      <hr />
      <main>{props.children}</main>
    </div>
  );
}
