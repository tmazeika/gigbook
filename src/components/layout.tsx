import { signIn, signOut, useSession } from 'next-auth/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './layout.module.css';
import cn from 'classnames';

export default function Layout(
  props: React.PropsWithChildren<unknown>,
): JSX.Element {
  const [session] = useSession();
  const router = useRouter();

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
      <nav>
        <ul>
          <li>
            <a
              href="/clients"
              className={cn({ [styles.active]: router.route === '/clients' })}
            >
              Clients
            </a>
          </li>
          <li>
            <a
              href="/projects"
              className={cn({ [styles.active]: router.route === '/projects' })}
            >
              Projects
            </a>
          </li>
        </ul>
      </nav>
      <hr />
      <main>{props.children}</main>
    </div>
  );
}
