import { patchUser } from 'gigbook/api-client';
import { User } from 'gigbook/models/user';
import { urlEnc } from 'gigbook/util/url';
import { useSession } from 'next-auth/client';
import useSWR from 'swr';

interface Options {
  fetch: boolean;
}

interface Hook {
  user: User | undefined;

  update(user: Partial<User>, signal: AbortSignal): Promise<User>;
}

export default function useUser(options: Options = { fetch: true }): Hook {
  const [session] = useSession();
  const { data: user, mutate } = useSWR<User>(
    options.fetch && session ? urlEnc('/api/users', session.user.id) : null,
  );
  return {
    user,
    async update(user: Partial<User>, signal: AbortSignal): Promise<User> {
      if (!session) {
        throw { message: 'Login required' };
      }
      const dbUser = await patchUser(session.user.id, user, signal);
      await mutate();
      return dbUser;
    },
  };
}
