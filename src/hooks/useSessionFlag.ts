"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function read(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

/**
 * A boolean persisted in sessionStorage (per tab). Storage may be blocked
 * (private mode, previews), in which case it silently behaves as in-memory false.
 */
export function useSessionFlag(key: string) {
  const subscribe = useCallback((cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  }, []);
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => false,
  );
  const set = useCallback(
    (next: boolean) => {
      try {
        if (next) window.sessionStorage.setItem(key, "1");
        else window.sessionStorage.removeItem(key);
      } catch {
        /* storage unavailable: fine */
      }
      listeners.forEach((l) => l());
    },
    [key],
  );
  return [value, set] as const;
}
