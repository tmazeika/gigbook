import Link from 'next/link';
import useAuth from '../hooks/useAuth';
import SignOutButton from './auth/signOutButton';
import styles from './header.module.css';

export default function Header(): JSX.Element {
  const auth = useAuth();
  return (
    <header className={styles.header}>
      <h3>GigBook</h3>
      <div className="flex-spacer" />
      {auth.user ? (
        <>
          <span>{auth.user.email}</span>
          <SignOutButton />
        </>
      ) : (
        <>
          <Link href="/sign-in">
            <button>Sign In</button>
          </Link>
          <Link href="/register">
            <button>Register</button>
          </Link>
        </>
      )}
    </header>
  );
}
