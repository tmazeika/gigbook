import Clockify, { ClockifyWorkspace } from 'gigbook/clockify/client';
import { useEffect, useState } from 'react';

export default function useClockifyWorkspaces(
  apiKey?: string,
): ClockifyWorkspace[] | undefined {
  const [workspaces, setWorkspaces] = useState<ClockifyWorkspace[]>();

  const validApiKey = apiKey?.length === 48 ? apiKey : null;
  useEffect(() => {
    setWorkspaces(undefined);
    if (validApiKey) {
      void new Clockify(validApiKey).getWorkspaces().then(setWorkspaces);
    }
  }, [validApiKey]);

  return workspaces;
}
