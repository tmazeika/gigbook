import { useCallback, useState } from 'react';

export type Storable =
  | null
  | string
  | number
  | boolean
  | Storable[]
  | { [K in string]: Storable };

export default function useLocalStorage<T, U extends Storable>(
  key: string,
  initialValue: T,
  fromStorable: (value: U) => T,
  toStorable: (value: T) => U,
): readonly [T | null, (value: T) => void] {
  const [value] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    const v = window.localStorage.getItem(key);
    return v === null ? null : fromStorable(JSON.parse(v));
  });
  const setValue = useCallback(
    (value: T) => {
      window.localStorage.setItem(key, JSON.stringify(toStorable(value)));
    },
    [key, toStorable],
  );
  return [value, setValue] as const;
}
