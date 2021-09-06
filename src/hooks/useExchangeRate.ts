import { getExchangeRate } from 'gigbook/api-client';
import useSignal from 'gigbook/hooks/useSignal';
import { buildRelUrl } from 'gigbook/util/url';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export default function useExchangeRate(
  from?: string,
  to?: string,
  at: DateTime = DateTime.now(),
): number | undefined {
  const atStr = at.toISO();
  const { data } = useSWR<number>(
    from && to && from !== to
      ? buildRelUrl('/api/exchange-rate', { from, to, at: atStr })
      : null,
  );

  const signal = useSignal();
  const [rate, setRate] = useState(from && to && from === to ? 1 : undefined);

  useEffect(() => {
    if (from && to && from !== to) {
      getExchangeRate({ from, to, at: atStr }, signal)
        .then(setRate)
        .catch(console.error);
    } else if (from && to && from === to) {
      setRate(1);
    } else {
      setRate(undefined);
    }
  }, [signal, from, to, atStr]);

  return rate;
}
