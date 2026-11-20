"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
  as?: "div" | "li" | "p" | "figure" | "header" | "span";
}

const tags = { div: m.div, li: m.li, p: m.p, figure: m.figure, header: m.header, span: m.span };

/**
 * Fades content up as it enters the viewport, once. Content is always in the
 * DOM, so screen readers and search for text are unaffected.
 */
export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: RevealProps) {
  const Tag = tags[as];
  return (
    <Tag
      data-reveal
      className={className}
      initial={{ opacity: 0, y, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Tag>
  );
}
