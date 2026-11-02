import { useEffect, useState } from 'react';

/** The part of a WXT storage item this hook needs. */
export interface WatchableItem<T> {
  getValue(): Promise<T>;
  watch(callback: (next: T) => void): () => void;
}

/**
 * Current value of a storage item, kept in sync with other tabs. `undefined` while loading.
 * The setter only updates the local state, for optimistic updates before writing to storage.
 */
export function useStorageValue<T>(item: WatchableItem<T>) {
  const [value, setValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    void item.getValue().then((stored) => {
      if (alive) setValue(() => stored);
    });
    const unwatch = item.watch((next) => setValue(() => next));
    return () => {
      alive = false;
      unwatch();
    };
  }, [item]);

  return [value, setValue] as const;
}
