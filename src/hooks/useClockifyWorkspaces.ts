import { ClockifyWorkspace } from 'gigbook/clockify/client';
import useClockifyApiClient from 'gigbook/hooks/useClockifyApiClient';
import useSignal from 'gigbook/hooks/useSignal';
import { useEffect, useState } from 'react';

export default function useClockifyWorkspaces():
  | ClockifyWorkspace[]
  | undefined {
  const signal = useSignal();
  const clockify = useClockifyApiClient();
  const [workspaces, setWorkspaces] = useState<ClockifyWorkspace[]>();

  useEffect(() => {
    if (clockify) {
      clockify.getWorkspaces(signal).then(setWorkspaces).catch(console.error);
    }
    return () => setWorkspaces(undefined);
  }, [signal, clockify]);

  return workspaces;
}
