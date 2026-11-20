"use client";

import { m, useScroll, useSpring } from "motion/react";
import { useRef } from "react";

/** A thin gold thread that draws downward as its container scrolls past. */
export function ScrollLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  return (
    <div ref={ref} aria-hidden className={className}>
      <div className="bg-gold-500/20 absolute inset-0" />
      <m.div className="bg-gold-500 absolute inset-0 origin-top" style={{ scaleY }} />
    </div>
  );
}
