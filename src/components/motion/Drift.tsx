"use client";

import { m, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Drifts its content sideways as it scrolls through the viewport, like a slow
 * camera pan. Transform-only; MotionConfig's reducedMotion="user" stills it.
 */
export function Drift({
  children,
  distance = 40,
  className,
}: {
  children: ReactNode;
  /** Total horizontal travel in px (negative drifts left). */
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [-distance / 2, distance / 2]);
  return (
    <div ref={ref} className={className}>
      <m.div style={{ x }}>{children}</m.div>
    </div>
  );
}
