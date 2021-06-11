import useSWR from 'swr';

export interface EntitiesHook<E> {
  data: E[];
  isLoading: boolean;

  save(entity: Omit<E, 'id'>): Promise<void>;
}

export default function useEntities<E>(url: string): EntitiesHook<E> {
  const { data, mutate, error, revalidate } = useSWR<E[], unknown>(url);
  return {
    data: data ?? [],
    isLoading: !error && !data,
    async save(entity: E): Promise<void> {
      const tmpEntity: E = {
        ...entity,
        id: Math.random().toString(),
      };
      await mutate([...(data ?? []), tmpEntity], false);
      const res = await fetch(url, {
        method: 'POST',
        body: new URLSearchParams(
          Object.entries(entity).map(([k, v]) => [k, String(v)]),
        ),
      });
      if (!res.ok) {
        await revalidate();
      }
    },
  };
}
