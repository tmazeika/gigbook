import { Dispatch, SetStateAction, useEffect } from 'react';

export default function useLocalStorage<S>(
  key: string,
  state: [S, Dispatch<SetStateAction<S>>],
): typeof state {
  const [data, setData] = state;

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item !== null) {
      setData(JSON.parse(item));
    }
  }, [key, setData]);

  useEffect(() => {
    if (data === undefined) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(data));
    }
  }, [key, data]);

  return state;
}
