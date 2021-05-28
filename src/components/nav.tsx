import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './nav.module.css';

const navItems = [
  {
    name: 'Overview',
    route: '/',
  },
  {
    name: 'Clients',
    route: '/clients',
  },
  {
    name: 'Projects',
    route: '/projects',
  },
  {
    name: 'Time Tracking',
    route: '/time-tracking',
  },
  {
    name: 'Line Items',
    route: '/line-items',
  },
];

export default function Nav(): JSX.Element {
  const activeRoute = useRouter().route;
  return (
    <nav>
      <ul className={styles.navItems}>
        {navItems.map(({ name, route }) => (
          <li key={name}>
            <Link href={route}>
              <a
                className={cn(styles.navItem, {
                  [styles.active]: route === activeRoute,
                })}
              >
                {name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
