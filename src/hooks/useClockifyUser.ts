import { ClockifyUser } from 'gigbook/clockify/client';
import useClockify from 'gigbook/hooks/useClockify';
import { useEffect, useState } from 'react';

export default function useClockifyUser(): ClockifyUser | undefined {
  const clockify = useClockify();
  const [user, setUser] = useState<ClockifyUser>();

  useEffect(() => {
    if (clockify) {
      clockify.getUser().then(setUser).catch(console.error);
    }
    return () => setUser(undefined);
  }, [clockify]);

  return user;
}
