import Head from 'next/head';
import type { ReactNode } from 'react';
import Header from './header';
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
      <Header />
      <div className={styles.layoutBottom}>
        <Sidebar />
        <main className={styles.content}>{props.children}</main>
      </div>
    </div>
  );
}
