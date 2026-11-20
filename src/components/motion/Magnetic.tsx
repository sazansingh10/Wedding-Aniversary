"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import type { ReactNode } from "react";
import { useFinePointerMotion } from "@/hooks/useMedia";
import { spring } from "@/lib/motion";

/**
 * Gently pulls its child toward the mouse when the pointer is near, then
 * springs back. Mouse only; inert on touch and with reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.35,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const enabled = useFinePointerMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring.follow);
  const sy = useSpring(y, spring.follow);

  return (
    <m.div
      className="inline-block"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (!enabled || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.div>
  );
}
