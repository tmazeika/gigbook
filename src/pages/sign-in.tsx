import { useRouter } from 'next/router';
import type { SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import useAuth from '../hooks/useAuth';

export default function SignIn(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const auth = useAuth();
  const isSignedIn = auth.user !== undefined;

  useEffect(() => {
    if (isSignedIn) {
      void router.replace('/');
    }
  }, [isSignedIn, router]);

  function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    auth
      .signIn(email, password)
      .catch((e) => {
        if (e instanceof Error) {
          setError(e.message);
        }
      })
      .finally(() => setLoading(false));
  }

  return (
    <Layout>
      {error && <span>{error}</span>}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </Layout>
  );
}
