import Clockify, { ClockifyClient } from 'gigbook/clockify/client';
import { useEffect, useState } from 'react';

export default function useClockifyClients(
  apiKey?: string,
  workspaceId?: string,
): ClockifyClient[] | undefined {
  const [clients, setClients] = useState<ClockifyClient[]>();

  const validApiKey = apiKey?.length === 48 ? apiKey : null;
  useEffect(() => {
    setClients(undefined);
    if (validApiKey && workspaceId) {
      void new Clockify(validApiKey).getClients(workspaceId).then(setClients);
    }
  }, [validApiKey, workspaceId]);

  return clients;
}
