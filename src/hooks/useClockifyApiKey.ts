import useSWR from 'swr';

export interface ClockifyApiKey {
  value?: string;

  update(value: string): Promise<void>;
}

export default function useClockifyApiKey(): ClockifyApiKey {
  const { data, mutate } = useSWR<{ value: string | null }>(
    '/api/clockify/api-key',
  );

  return {
    value: data?.value ?? undefined,
    async update(value: string): Promise<void> {
      const res = await fetch('/api/clockify/api-key', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });
      if (res.ok) {
        await mutate(await res.json(), false);
      }
    },
  };
}
