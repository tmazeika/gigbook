import { useEffect, useMemo } from 'react';

export default function useSignal(): AbortSignal {
  const controller = useMemo(() => new AbortController(), []);
  useEffect(() => () => controller.abort(), [controller]);
  return controller.signal;
}
