import { encode } from 'gigbook/json';
import { Client } from 'gigbook/models/client';
import { Invoice } from 'gigbook/models/invoice';
import { InvoicePrefill } from 'gigbook/models/invoicePrefill';
import { User } from 'gigbook/models/user';
import { extFetcher } from 'gigbook/util/fetch';
import { LossySerializable } from 'gigbook/util/serialization';
import { buildRelUrl, urlEnc } from 'gigbook/util/url';

const clientsCol = '/api/clients';
const invoicesCol = '/api/invoices';
const usersCol = '/api/users';

export const getClients = (signal: AbortSignal): Promise<Client[]> =>
  request({
    path: clientsCol,
    signal,
  });

export const postClients = (
  client: Client,
  signal: AbortSignal,
): Promise<Client> =>
  request({
    path: clientsCol,
    method: 'POST',
    body: client,
    signal,
  });

export const deleteClients = (signal: AbortSignal): Promise<void> =>
  request({
    path: clientsCol,
    method: 'DELETE',
    signal,
  });

export const getClient = (id: string, signal: AbortSignal): Promise<Client> =>
  request({
    path: [clientsCol, id],
    signal,
  });

export const patchClient = (
  id: string,
  body: Partial<Client>,
  signal: AbortSignal,
): Promise<void> =>
  request({
    path: [clientsCol, id],
    method: 'PATCH',
    body,
    signal,
  });

export const deleteClient = (id: string, signal: AbortSignal): Promise<void> =>
  request({
    path: [clientsCol, id],
    method: 'DELETE',
    signal,
  });

export const postInvoices = (
  invoice: Invoice,
  signal: AbortSignal,
): Promise<Invoice> =>
  request({
    path: invoicesCol,
    method: 'POST',
    body: invoice,
    signal,
  });

export const getInvoicePrefill = (
  signal: AbortSignal,
): Promise<InvoicePrefill> =>
  request({
    path: [invoicesCol, 'prefill'],
    signal,
  });

export const patchUser = (
  id: string,
  body: Partial<User>,
  signal: AbortSignal,
): Promise<User> =>
  request({
    path: [usersCol, id],
    method: 'PATCH',
    body,
    signal,
  });

interface GetExchangeRateArgs {
  from: string;
  to: string;
  at: string;
}

export const getExchangeRate = (
  args: GetExchangeRateArgs,
  signal: AbortSignal,
): Promise<number> =>
  request({
    path: '/api/exchange-rate',
    query: { ...args },
    signal,
  });

interface SendJsonOptions {
  path: string | [string, string];
  query?: Record<string, unknown>;
  method?: string;
  body?: LossySerializable;
  signal: AbortSignal;
}

export const request = <R>({
  path: prePath,
  query,
  method,
  body,
  signal,
}: SendJsonOptions): Promise<R> => {
  const path = Array.isArray(prePath) ? urlEnc(...prePath) : prePath;
  return extFetcher(buildRelUrl(path, query), {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? encode(body) : undefined,
    signal,
  }).then((body) => body as R);
};
