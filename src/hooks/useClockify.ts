import Clockify from 'gigbook/clockify/client';
import useClockifyApiKey from 'gigbook/hooks/useClockifyApiKey';
import { useMemo } from 'react';

export default function useClockify(): Clockify | undefined {
  const { value: apiKey } = useClockifyApiKey();
  return useMemo(
    () => (apiKey === undefined ? undefined : new Clockify(apiKey)),
    [apiKey],
  );
}
