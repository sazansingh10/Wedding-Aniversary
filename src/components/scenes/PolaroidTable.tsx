"use client";

import { m } from "motion/react";
import { useRef, useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { useMedia } from "@/hooks/useMedia";
import { cn } from "@/lib/cn";
import { spring } from "@/lib/motion";
import type { Polaroid, PhotoId, ResolvedPhoto } from "@/types/content";

interface PolaroidTableProps {
  eyebrow: string;
  headline: string;
  hintFine: string;
  hintCoarse: string;
  items: Polaroid[];
  photos: Record<PhotoId, ResolvedPhoto>;
}

/** Where each print lands on the table (percent of the table) and its tilt. */
const SCATTER = [
  { x: 3, y: 6, r: -7 },
  { x: 26, y: 1, r: 4 },
  { x: 50, y: 9, r: -3 },
  { x: 75, y: 3, r: 8 },
  { x: 8, y: 47, r: 5 },
  { x: 32, y: 44, r: -6 },
  { x: 56, y: 50, r: 3 },
  { x: 78, y: 45, r: -4 },
];

/**
 * A table of loose prints. With a mouse they can be dragged anywhere (the one
 * you pick up comes to the top); clicking turns one over to read the note on the
 * back. On touch screens they sit in a scattered grid, so the page still
 * scrolls normally, and a tap turns them over. Keyboard: Tab to a print, Enter
 * to flip.
 */
export function PolaroidTable({
  eyebrow,
  headline,
  hintFine,
  hintCoarse,
  items,
  photos,
}: PolaroidTableProps) {
  const canDrag = useMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
  const table = useRef<HTMLDivElement | null>(null);
  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i));
  const [flipped, setFlipped] = useState<Set<number>>(() => new Set());
  const dragging = useRef(false);

  const bringToFront = (i: number) => setOrder((o) => [...o.filter((x) => x !== i), i]);
  const toggle = (i: number) => {
    if (dragging.current) return;
    setFlipped((f) => {
      const next = new Set(f);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <section
      id="table"
      aria-labelledby="table-title"
      className="bg-wine-900 text-ivory-50 relative overflow-hidden py-24 sm:py-32"
    >
      {/* felt surface + a pool of lamplight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 50% at 50% 55%, rgba(227,207,164,0.16), transparent 70%), radial-gradient(120% 90% at 50% 120%, rgba(22,5,9,0.9), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <header className="max-w-2xl">
          <p className="eyebrow text-gold-300">{eyebrow}</p>
          <h2 id="table-title" className="display-lg mt-5 text-balance">
            {headline}
          </h2>
          <p className="text-ivory-100/65 mt-5 text-sm tracking-wide">
            {canDrag ? hintFine : hintCoarse}
          </p>
        </header>

        <div
          ref={table}
          className={cn(
            "relative mt-12",
            canDrag
              ? "h-[min(46rem,82vh)]"
              : "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6",
          )}
        >
          {items.map((item, i) => {
            const photo = photos[item.photo];
            const pos = SCATTER[i % SCATTER.length];
            const isFlipped = flipped.has(i);
            return (
              <m.div
                key={item.photo}
                className={cn(canDrag ? "absolute w-[13.5rem] xl:w-[15rem]" : "relative w-full")}
                style={
                  canDrag
                    ? { left: `${pos.x}%`, top: `${pos.y}%`, zIndex: order.indexOf(i) + 1 }
                    : undefined
                }
                initial={{ opacity: 0, y: 40, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: canDrag ? pos.r : pos.r * 0.5 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ ...spring.paper, delay: i * 0.07 }}
                drag={canDrag}
                dragConstraints={table}
                dragElastic={0.12}
                dragMomentum
                whileDrag={{ scale: 1.06, rotate: 0, cursor: "grabbing" }}
                whileHover={canDrag ? { scale: 1.03, transition: spring.snappy } : undefined}
                onPointerDown={() => bringToFront(i)}
                onDragStart={() => {
                  dragging.current = true;
                }}
                onDragEnd={() => {
                  // Let the click that ends a drag pass without flipping.
                  window.setTimeout(() => (dragging.current = false), 60);
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={isFlipped}
                  aria-label={`${item.label}. Turn the photo over to read the back.`}
                  className={cn(
                    "block w-full [perspective:1200px]",
                    canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                  )}
                >
                  <m.div
                    className="relative [transform-style:preserve-3d]"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={spring.paper}
                  >
                    {/* front */}
                    <div className="bg-ivory-50 p-2.5 pb-11 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.7)] [backface-visibility:hidden] sm:p-3 sm:pb-12">
                      <Photo
                        photo={photo}
                        decorative
                        ratio="1 / 1"
                        sizes="(min-width: 768px) 240px, 45vw"
                      />
                      <span className="font-hand text-wine-700 absolute right-0 bottom-2.5 left-0 text-center text-lg whitespace-nowrap sm:bottom-3 sm:text-2xl">
                        {item.label}
                      </span>
                    </div>
                    {/* back */}
                    <div className="absolute inset-0 flex [transform:rotateY(180deg)] items-center justify-center bg-[#f3ead9] p-5 text-center shadow-[0_18px_40px_-14px_rgba(0,0,0,0.7)] [backface-visibility:hidden]">
                      <p className="font-hand text-wine-700 text-[1.7rem] leading-tight sm:text-3xl">
                        {item.note}
                      </p>
                      <span className="text-wine-600/60 absolute right-3 bottom-2 text-[0.55rem] tracking-[0.25em] uppercase">
                        — S.
                      </span>
                    </div>
                  </m.div>
                </button>
                <p className="sr-only" aria-live="polite">
                  {isFlipped ? item.note : ""}
                </p>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
