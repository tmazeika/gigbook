import Clockify, { ClockifyUser } from 'gigbook/clockify/client';
import usePromises from 'gigbook/hooks/usePromises';
import { useEffect, useState } from 'react';

export default function useClockifyUser(
  apiKey: string,
): ClockifyUser | undefined {
  const promises = usePromises();
  const [user, setUser] = useState<ClockifyUser>();

  const validApiKey = apiKey.length === 48 ? apiKey : null;
  useEffect(() => {
    if (validApiKey) {
      void promises.run(new Clockify(validApiKey).getUser()).then(setUser);
    } else {
      setUser(undefined);
    }
  }, [promises, validApiKey]);

  return user;
}
