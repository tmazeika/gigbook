import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import AuthProvider from '../components/auth/authProvider';
import './_app.css';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SWRConfig>
  );
}
