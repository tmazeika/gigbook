import useClients from 'gigbook/hooks/useClients';
import { signIn, signOut, useSession } from 'next-auth/client';
import Head from 'next/head';

export default function Index(): JSX.Element {
  const [session, isLoading] = useSession();
  const clients = useClients();

  function createClient() {
    void clients.save({ name: Math.random().toString() });
  }

  return (
    <div>
      <Head>
        <title>GigBook</title>
      </Head>
      <main>
        <h1>Clients: {clients.data.map((u) => u.name).join(', ')}</h1>
        <button onClick={() => createClient()}>Create new client</button>
        <br />
        <br />
        {isLoading && <span>Loading...</span>}
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
