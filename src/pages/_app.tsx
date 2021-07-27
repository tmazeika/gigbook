import 'bootstrap/dist/css/bootstrap.min.css';
import { ApiError } from 'gigbook/models/apiError';
import type { Session } from 'next-auth';
import { Provider as AuthProvider } from 'next-auth/client';
import type { AppProps as NextAppProps } from 'next/app';
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
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then(async (res) => {
            const body: unknown = await res.json();
            if (!res.ok) {
              throw body as ApiError;
            }
            return body;
          }),
      }}
    >
      <AuthProvider session={pageProps.session}>
        <Component {...pageProps} />
      </AuthProvider>
    </SWRConfig>
  );
}
