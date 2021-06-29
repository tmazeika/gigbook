import useIsomorphicLayoutEffect from 'gigbook/hooks/useIsomorphicLayoutEffect';
import { useState } from 'react';

let i = 0;

export default function useId(): string {
  const [id, setId] = useState('');
  useIsomorphicLayoutEffect(() => setId(`i${i++}`), []);
  return id;
}
