import 'bootstrap/dist/css/bootstrap.min.css';
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

export default function App({
  Component,
  pageProps,
}: SessionAppProps): JSX.Element {
  return (
    <SWRConfig value={{ fetcher }}>
      <AuthProvider session={pageProps.session}>
        <Component {...pageProps} />
      </AuthProvider>
    </SWRConfig>
  );
}

function fetcher(resource: RequestInfo, init?: RequestInit) {
  return fetch(resource, init).then(async (res) => {
    const body: unknown = await res.json();
    if (!res.ok) {
      throw body;
    }
    return body;
  });
}
