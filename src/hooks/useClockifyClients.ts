import { ClockifyClient } from 'gigbook/clockify/client';
import useClockify from 'gigbook/hooks/useClockify';
import { useEffect, useState } from 'react';

export default function useClockifyClients(
  workspaceId?: string,
): ClockifyClient[] | undefined {
  const clockify = useClockify();
  const [clients, setClients] = useState<ClockifyClient[]>();

  useEffect(() => {
    if (clockify && workspaceId) {
      clockify.getClients(workspaceId).then(setClients).catch(console.error);
    }
    return () => setClients(undefined);
  }, [clockify, workspaceId]);

  return clients;
}
