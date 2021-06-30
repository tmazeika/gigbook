import 'gigbook/pages/_app.css';
import type { Session } from 'next-auth';
import { Provider as AuthProvider } from 'next-auth/client';
import type { AppProps as NextAppProps } from 'next/app';
import { SWRConfig } from 'swr';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';

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
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <AuthProvider session={pageProps.session}>
        <LeafyGreenProvider>
          <Component {...pageProps} />
        </LeafyGreenProvider>
      </AuthProvider>
    </SWRConfig>
  );
}
