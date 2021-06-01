import AuthProvider from 'gigbook/components/authProvider';
import 'gigbook/pages/_app.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SWRConfig
      value={{
        fetcher(resource, init) {
          return fetch(resource, init).then((res) => res.json());
        },
      }}
    >
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SWRConfig>
  );
}
