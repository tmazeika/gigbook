import { codec } from 'gigbook/json';
import { Serializable } from 'gigbook/util/serialization';
import { useCallback, useState } from 'react';

export default function useLocalStorage<T extends Serializable>(
  key: string,
  initialValue: T,
): readonly [T, (value: T) => void] {
  const [value] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    const v = window.localStorage.getItem(key);
    return v === null ? initialValue : (codec.decode(v) as T);
  });
  const setValue = useCallback(
    (value: T) => window.localStorage.setItem(key, codec.encode(value)),
    [key],
  );
  return [value, setValue];
}
