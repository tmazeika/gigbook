import type { AppProps } from 'next/app';
import './_app.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
