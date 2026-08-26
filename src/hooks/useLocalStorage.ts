"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("local-storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("local-storage", callback);
  };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const cache = useRef<{ raw: string | null; value: T }>({
    raw: null,
    value: initialValue,
  });

  const getSnapshot = useCallback(() => {
    const raw = window.localStorage.getItem(key);
    if (raw === cache.current.raw) {
      return cache.current.value;
    }

    let value = initialValue;
    if (raw) {
      try {
        value = JSON.parse(raw) as T;
      } catch {
        value = initialValue;
      }
    }

    cache.current = { raw, value };
    return value;
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => initialValue, [initialValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: T) => {
      window.localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new Event("local-storage"));
    },
    [key]
  );

  return [value, setValue] as const;
}
