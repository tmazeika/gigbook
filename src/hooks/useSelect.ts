import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export default function useSelect<T>(
  items?: T[],
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
  const [selected, setSelected] = useState<T>();

  const first = items?.[0];
  useEffect(() => {
    setSelected(first);
  }, [first]);

  return [selected, setSelected];
}
