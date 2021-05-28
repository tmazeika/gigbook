import Head from 'next/head';
import type { ReactNode } from 'react';
import styles from './layout.module.css';
import Sidebar from './sidebar';

export type LayoutProps = {
  children?: ReactNode;
};

export default function Layout(props: LayoutProps): JSX.Element {
  return (
    <div className={styles.layout}>
      <Head>
        <title>GigBook</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
      <main>{props.children}</main>
    </div>
  );
}
