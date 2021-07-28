import { buildRelUrl } from 'gigbook/util/url';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

export default function useExchangeRate(
  from?: string,
  to?: string,
  date?: DateTime,
): number | undefined {
  const [rate, setRate] = useState<number | undefined>(
    from === to ? 1 : undefined,
  );
  const dateStr = date?.toISO();

  useEffect(() => {
    if (from !== to && from && to && dateStr) {
      fetch(buildRelUrl('/api/exchange-rate', { from, to, date: dateStr }))
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
  }, [from, to, dateStr]);

  return rate;
}
