import { useSession } from 'next-auth/client';
import Head from 'next/head';
import React from 'react';

export interface InvoiceProps {
  invoiceId: string;
}

export default function Invoice(props: InvoiceProps): JSX.Element {
  const [session] = useSession();

  if (!session) {
    return <></>;
  }
  return (
    <>
      <Head>
        <title>Invoice </title>
      </Head>
    </>
  );
}
