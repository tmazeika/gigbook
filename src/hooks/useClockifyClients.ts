import { ClockifyClient } from 'gigbook/clockify/client';
import useClockifyApiClient from 'gigbook/hooks/useClockifyApiClient';
import useSignal from 'gigbook/hooks/useSignal';
import { useEffect, useState } from 'react';

export default function useClockifyClients(
  workspaceId?: string,
): ClockifyClient[] | undefined {
  const signal = useSignal();
  const clockify = useClockifyApiClient();
  const [clients, setClients] = useState<ClockifyClient[]>();

  useEffect(() => {
    if (clockify && workspaceId) {
      clockify
        .getClients(workspaceId, signal)
        .then(setClients)
        .catch(console.error);
    }
    return () => setClients(undefined);
  }, [signal, clockify, workspaceId]);

  return clients;
}
