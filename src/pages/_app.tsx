import 'gigbook/pages/_app.css';
import { Provider } from 'next-auth/client';
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
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */}
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </SWRConfig>
  );
}
