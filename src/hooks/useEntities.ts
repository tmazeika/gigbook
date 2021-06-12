import useSWR from 'swr';

export interface EntitiesHook<E> {
  data: E[];
  isLoading: boolean;

  save(entity: Omit<E, 'id'>): Promise<void>;
  deleteAll(): Promise<void>;
}

export default function useEntities<E>(url: string): Readonly<EntitiesHook<E>> {
  const { data, mutate, error, revalidate } = useSWR<E[], unknown>(url);
  return {
    data: data ?? [],
    isLoading: !error && !data,
    async save(entity: E) {
      const tmpEntity: E = {
        ...entity,
        id: Math.random().toString(),
      };
      await mutate([...(data ?? []), tmpEntity], false);
      const { ok } = await fetch(url, {
        method: 'POST',
        body: new URLSearchParams(
          Object.entries(entity).map(([k, v]) => [k, String(v)]),
        ),
      });
      if (!ok) {
        await revalidate();
      }
    },
    async deleteAll() {
      await mutate([], false);
      const { ok } = await fetch(url, {
        method: 'DELETE',
      });
      if (!ok) {
        await revalidate();
      }
    },
  };
}
