import useEntities, { EntitiesHook } from 'gigbook/hooks/useEntities';
import { Client } from 'gigbook/models/client';

export default function useClients(): EntitiesHook<Client> {
  return useEntities('/api/clients');
}
