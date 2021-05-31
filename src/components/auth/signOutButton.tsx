import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

export default function SignOutButton(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  function signOut() {
    setLoading(true);
    auth.signOut().catch((e) => {
      setLoading(false);
      console.error(e);
    });
  }

  return (
    <button onClick={signOut}>{loading ? 'Signing out...' : 'Sign Out'}</button>
  );
}
