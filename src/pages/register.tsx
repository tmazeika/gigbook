import { useRouter } from 'next/router';
import type { SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import useAuth from '../hooks/useAuth';

export default function Register(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
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
    if (password !== password2) {
      setError('Password confirmation must match password');
      return;
    }
    setLoading(true);
    auth
      .register(email, password)
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
        <div>
          <label htmlFor="password2">Confirm Password</label>
          <input
            id="password2"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </Layout>
  );
}
