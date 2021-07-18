import { useEffect, useState } from 'react';

export default function useLocalStorage<T>(key: string, value: T): T {
  const [storedValue, setStoredValue] = useState(value);

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item !== null) {
      setStoredValue(JSON.parse(item));
    }
  }, [key]);

  useEffect(() => {
    if (value === undefined || value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return storedValue;
}
