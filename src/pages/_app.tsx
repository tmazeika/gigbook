import 'bootstrap/dist/css/bootstrap.min.css';
import { extFetcher as fetcher } from 'gigbook/util/fetch';
import type { Session } from 'next-auth';
import { Provider as AuthProvider } from 'next-auth/client';
import type { AppProps as NextAppProps } from 'next/app';
import React from 'react';
import { SWRConfig } from 'swr';

type AppProps<T> = Omit<NextAppProps<T>, 'pageProps'> & {
  pageProps: T;
};

type SessionAppProps = AppProps<{
  session?: Session;
}>;

export default function GigBookApp({
  Component,
  pageProps,
}: SessionAppProps): JSX.Element {
  return (
    <AuthProvider session={pageProps.session}>
      <SWRConfig value={{ fetcher }}>
        <Component {...pageProps} />
      </SWRConfig>
    </AuthProvider>
  );
}
