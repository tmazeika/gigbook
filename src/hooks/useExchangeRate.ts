import { buildRelUrl } from 'gigbook/util/url';
import { useEffect, useState } from 'react';

export default function useExchangeRate(
  from?: string,
  to?: string,
): number | undefined {
  const [rate, setRate] = useState<number | undefined>(
    from === to ? 1 : undefined,
  );

  useEffect(() => {
    if (from !== to && from && to) {
      fetch(buildRelUrl('/api/exchange-rate', { from, to }))
        .then((res) => {
          if (res.ok) {
            return res;
          }
          throw new Error(`${res.status} ${res.statusText}`);
        })
        .then((res) => res.json())
        .then(({ rate }) => {
          setRate(rate);
        })
        .catch(console.error);
    } else {
      setRate(1);
    }
  }, [from, to]);

  return rate;
}
