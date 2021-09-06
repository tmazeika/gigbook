import { ClockifyUser } from 'gigbook/clockify/client';
import useClockifyApiClient from 'gigbook/hooks/useClockifyApiClient';
import useSignal from 'gigbook/hooks/useSignal';
import { useEffect, useState } from 'react';

export default function useClockifyUser(): ClockifyUser | undefined {
  const signal = useSignal();
  const clockify = useClockifyApiClient();
  const [user, setUser] = useState<ClockifyUser>();

  useEffect(() => {
    if (clockify) {
      clockify.getUser(signal).then(setUser).catch(console.error);
    }
    return () => setUser(undefined);
  }, [signal, clockify]);

  return user;
}
