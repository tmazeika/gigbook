import ClockifyApiClient from 'gigbook/clockify/client';
import useUser from 'gigbook/hooks/useUser';
import { useMemo } from 'react';

export default function useClockifyApiClient(): ClockifyApiClient | undefined {
  const { user } = useUser();
  const apiKey = user?.clockifyApiKey;

  return useMemo(
    () => (apiKey ? new ClockifyApiClient(apiKey) : undefined),
    [apiKey],
  );
}
