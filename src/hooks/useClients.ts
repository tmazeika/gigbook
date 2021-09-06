import {
  deleteClient,
  deleteClients,
  patchClient,
  postClients,
} from 'gigbook/api-client';
import { Client } from 'gigbook/models/client';
import useSWR from 'swr';

interface Options {
  fetch: boolean;
}

interface Hook {
  clients: Client[] | undefined;

  create(client: Client, signal: AbortSignal): Promise<string>;

  update(
    id: string,
    client: Partial<Client>,
    signal: AbortSignal,
  ): Promise<void>;

  deleteOne(id: string, signal: AbortSignal): Promise<void>;

  deleteAll(signal: AbortSignal): Promise<void>;
}

export default function useClients(options: Options = { fetch: true }): Hook {
  const { data: clients, mutate } = useSWR<Client[]>(
    options.fetch ? '/api/clients' : null,
  );
  return {
    clients,
    async create(client: Client, signal: AbortSignal): Promise<string> {
      await postClients(client, signal);
      await mutate();
      return '/clients';
    },
    async update(
      id: string,
      client: Partial<Client>,
      signal: AbortSignal,
    ): Promise<void> {
      await patchClient(id, client, signal);
      await mutate();
    },
    async deleteOne(id: string, signal: AbortSignal): Promise<void> {
      await deleteClient(id, signal);
      await mutate();
    },
    async deleteAll(signal: AbortSignal): Promise<void> {
      await deleteClients(signal);
      await mutate();
    },
  };
}
