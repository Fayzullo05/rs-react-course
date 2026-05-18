import { useCallback, useState } from 'react';

export function useLocalStorage(key: string, initialValue = '') {
  const [value, setStoredValue] = useState(() => {
    return localStorage.getItem(key) ?? initialValue;
  });

  const setValue = useCallback(
    (newValue: string) => {
      localStorage.setItem(key, newValue);
      setStoredValue(newValue);
    },
    [key]
  );

  return [value, setValue] as const;
}
