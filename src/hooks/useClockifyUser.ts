import Clockify, { ClockifyUser } from 'gigbook/clockify/client';
import { useEffect, useState } from 'react';

export default function useClockifyUser(
  apiKey: string,
): ClockifyUser | undefined {
  const [user, setUser] = useState<ClockifyUser>();

  const validApiKey = apiKey.length === 48 ? apiKey : null;
  useEffect(() => {
    setUser(undefined);
    if (validApiKey) {
      void new Clockify(validApiKey).getUser().then(setUser);
    }
  }, [validApiKey]);

  return user;
}
