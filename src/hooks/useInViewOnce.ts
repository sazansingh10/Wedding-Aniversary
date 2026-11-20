"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Flags an element once it has entered the viewport. A single observer per
 * element, disconnected as soon as it fires.
 */
export function useInViewOnce<T extends Element>(rootMargin = "0px 0px -15% 0px") {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setSeen(true));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, seen]);

  return [ref, seen] as const;
}
