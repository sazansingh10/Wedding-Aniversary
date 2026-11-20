"use client";

import { useEffect, useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cn } from "@/lib/cn";
import type { Letter as LetterContent, ResolvedPhoto } from "@/types/content";

interface LetterProps {
  letter: LetterContent;
  photo?: ResolvedPhoto;
}

const STEP_MS = 2200;

/**
 * Scene 5, the centrepiece. When the letter scrolls into view its paragraphs
 * surface one at a time, like ink settling. All text is in the DOM from the
 * start (only opacity changes), and "Show the whole letter" shows everything at once.
 */
export function Letter({ letter, photo }: LetterProps) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>("0px 0px -25% 0px");
  const total = letter.paragraphs.length + 2; // salutation … paragraphs … signature
  const [shown, setShown] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const all = skipped || shown >= total;

  useEffect(() => {
    if (!inView || all) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(
      () => setShown((s) => (reduce ? total : s + 1)),
      shown === 0 ? 200 : STEP_MS,
    );
    return () => window.clearTimeout(id);
  }, [inView, shown, all, total]);

  const visible = (i: number) => all || i < shown;
  const piece = (i: number) =>
    cn(
      "transition-[opacity,filter,transform] duration-[1600ms] ease-(--ease-cinema)",
      visible(i) ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-[3px] translate-y-2",
    );

  return (
    <section
      id="letter"
      aria-labelledby="letter-title"
      className="on-ivory bg-blush-100 relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        <header className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-wine-600">Chapter four · A letter from me</p>
          <h2 id="letter-title" className="display-lg text-wine-800 mt-6 text-balance">
            {letter.title}
          </h2>
        </header>

        <div className="relative mx-auto mt-16 max-w-3xl sm:mt-20">
          {/* A photograph tucked behind the corner of the letter */}
          {photo && (
            <div
              aria-hidden
              className="bg-ivory-50 absolute -top-10 -right-2 z-0 hidden w-44 rotate-[7deg] p-2.5 pb-8 shadow-[0_20px_40px_-20px_rgba(58,17,31,0.5)] sm:block lg:-right-28 lg:w-56"
            >
              <Photo photo={photo} decorative ratio="4 / 5" sizes="224px" />
              <span className="font-hand text-wine-700 absolute right-0 bottom-1.5 left-0 text-center text-xl">
                us
              </span>
            </div>
          )}

          <div
            ref={ref}
            className="paper relative z-10 px-6 py-12 shadow-[0_40px_80px_-40px_rgba(58,17,31,0.45),0_2px_0_rgba(255,255,255,0.6)_inset] sm:px-14 sm:py-16 lg:px-20"
          >
            <p className={cn("font-hand text-wine-700 text-4xl sm:text-5xl", piece(0))}>
              {letter.salutation}
            </p>
            <div className="font-display text-charcoal-900 mt-8 space-y-6 text-[1.25rem] leading-[1.75] sm:text-[1.375rem]">
              {letter.paragraphs.map((p, i) => (
                <p key={i} className={cn("text-pretty", piece(i + 1))}>
                  {p}
                </p>
              ))}
            </div>
            <div className={cn("mt-12 text-right", piece(total - 1))}>
              <p className="font-display text-charcoal-700 text-xl italic">{letter.closing}</p>
              <p className="font-hand text-wine-700 mt-1 text-5xl sm:text-6xl">
                {letter.signature}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setSkipped(true)}
              className={cn(
                "border-wine-600/40 text-wine-700 hover:border-wine-600 hover:bg-wine-600/5 min-h-11 rounded-full border px-6 text-xs tracking-[0.22em] uppercase transition-all duration-500",
                all && "pointer-events-none opacity-0",
              )}
              aria-hidden={all}
              tabIndex={all ? -1 : 0}
            >
              Show the whole letter
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
