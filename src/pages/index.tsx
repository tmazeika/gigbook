import { signIn, signOut, useSession } from 'next-auth/client';
import Head from 'next/head';

export default function Index(): JSX.Element {
  const [session, loading] = useSession();
  return (
    <div>
      <Head>
        <title>GigBook</title>
      </Head>
      <main>
        {loading && <span>Loading...</span>}
        {!session && (
          <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
          </>
        )}
        {session && (
          <>
            Signed in as {session.user?.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )}
      </main>
    </div>
  );
}
