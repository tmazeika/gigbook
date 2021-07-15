import { ClockifyWorkspace } from 'gigbook/clockify/client';
import useClockify from 'gigbook/hooks/useClockify';
import { useEffect, useState } from 'react';

export default function useClockifyWorkspaces():
  | ClockifyWorkspace[]
  | undefined {
  const clockify = useClockify();
  const [workspaces, setWorkspaces] = useState<ClockifyWorkspace[]>();

  useEffect(() => {
    if (clockify) {
      clockify.getWorkspaces().then(setWorkspaces).catch(console.error);
    }
    return () => setWorkspaces(undefined);
  }, [clockify]);

  return workspaces;
}
