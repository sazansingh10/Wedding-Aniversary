"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Subscribes to a CSS media query. Returns `fallback` during SSR. */
export function useMedia(query: string, fallback = false): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

/** A precise pointer (mouse/trackpad) and no request for reduced motion. */
export function useFinePointerMotion(): boolean {
  const fine = useMedia("(hover: hover) and (pointer: fine)");
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  return fine && !reduce;
}
