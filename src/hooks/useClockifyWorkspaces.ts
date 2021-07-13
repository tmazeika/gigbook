import Clockify, { ClockifyWorkspace } from 'gigbook/clockify/client';
import { useEffect, useState } from 'react';

export default function useClockifyWorkspaces(
  apiKey?: string,
): ClockifyWorkspace[] | undefined {
  const [workspaces, setWorkspaces] = useState<ClockifyWorkspace[]>();

  const validApiKey = apiKey?.length === 48 ? apiKey : null;
  useEffect(() => {
    if (validApiKey) {
      void new Clockify(validApiKey).getWorkspaces().then(setWorkspaces);
    } else {
      setWorkspaces(undefined);
    }
  }, [validApiKey]);

  return workspaces;
}
