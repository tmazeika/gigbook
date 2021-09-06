import { decode, encode } from 'gigbook/json';
import { Serializable } from 'gigbook/util/serialization';
import { useCallback, useState } from 'react';

export default function useLocalStorage<T extends Serializable>(
  key: string,
  initialValue: T,
): readonly [T, (value: T) => void];

export default function useLocalStorage<T, U extends Serializable>(
  key: string,
  initialValue: T,
  fromSerializable: (value: U) => T,
  toSerializable: (value: T) => U,
): readonly [T, (value: T) => void];

export default function useLocalStorage<U extends Serializable, T = U>(
  key: string,
  initialValue: T,
  fromSerializable?: (value: U) => T,
  toSerializable?: (value: T) => U,
): readonly [T, (value: T) => void] {
  const [value] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    const v = window.localStorage.getItem(key);
    if (v === null) {
      return initialValue;
    }
    const parsed = decode(v);
    return fromSerializable === undefined
      ? (parsed as T)
      : fromSerializable(parsed as U);
  });
  const setValue = useCallback(
    (value: T) => {
      const serializable =
        toSerializable === undefined ? value : toSerializable(value);
      window.localStorage.setItem(key, encode(serializable));
    },
    [key, toSerializable],
  );
  return [value, setValue] as const;
}
