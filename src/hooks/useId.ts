import useIsomorphicLayoutEffect from 'gigbook/hooks/useIsomorphicLayoutEffect';
import { useState } from 'react';

let next = 0;

export default function useId(): string {
  const [id, setId] = useState('');
  useIsomorphicLayoutEffect(() => {
    setId(`id-${next++}`);
  }, []);
  return id;
}
