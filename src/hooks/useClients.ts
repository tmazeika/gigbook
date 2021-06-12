import useEntities, { EntitiesHook } from 'gigbook/hooks/useEntities';
import { Client } from 'gigbook/models/client';

export default function useClients(): Readonly<EntitiesHook<Client>> {
  return useEntities('/api/clients');
}
