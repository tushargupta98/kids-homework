import { useSyncExternalStore } from 'react';

/** Tiny localStorage-backed store with React subscription. */
export function createStore<T>(key: string, initial: T) {
  let state: T = initial;
  try {
    const raw = localStorage.getItem(key);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {
    // Private mode or bad JSON: fall back to defaults.
  }
  const listeners = new Set<() => void>();

  const get = () => state;
  const set = (next: T) => {
    state = next;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage full or unavailable: keep in-memory state.
    }
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };
  const useStore = () => useSyncExternalStore(subscribe, get, get);

  return { get, set, useStore };
}
