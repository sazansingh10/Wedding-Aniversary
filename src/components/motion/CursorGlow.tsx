"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";
import { useFinePointerMotion } from "@/hooks/useMedia";
import { spring } from "@/lib/motion";

/**
 * A soft, warm light that trails the mouse like a candle carried through the
 * page. Mouse/trackpad only; never on touch screens or with reduced motion.
 * Transform-only, so it never triggers layout.
 */
export function CursorGlow() {
  const enabled = useFinePointerMotion();
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, spring.follow);
  const sy = useSpring(y, spring.follow);
  const opacity = useMotionValue(0);
  const so = useSpring(opacity, { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(1);
    };
    const leave = () => opacity.set(0);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y, opacity]);

  if (!enabled) return null;
  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[55] -mt-[16rem] -ml-[16rem] size-[32rem] rounded-full mix-blend-soft-light"
      style={{
        x: sx,
        y: sy,
        opacity: so,
        background:
          "radial-gradient(circle, rgba(255,226,170,0.55) 0%, rgba(227,207,164,0.18) 35%, transparent 65%)",
      }}
    />
  );
}
