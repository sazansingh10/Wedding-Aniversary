"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";
import { Photo } from "@/components/ui/Photo";
import type { ResolvedPhoto, StrangerStory } from "@/types/content";

const STEP_MS = 2600;

/**
 * Prologue. A message notification on a phone at night. The sender reads
 * "a stranger"; one by one each name is struck through in gold and rewritten,
 * until it says "my wife". Plays once when scrolled into view, can be replayed
 * or stepped through by hand, and the whole sequence is available to screen readers.
 */
export function Stranger({
  story,
  her,
  stepPhotos,
}: {
  story: StrangerStory;
  her: string;
  /** The photo inside the message for each step (null for none). */
  stepPhotos: (ResolvedPhoto | null)[];
}) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>("0px 0px -30% 0px");
  const [step, setStep] = useState(0);
  const [striking, setStriking] = useState(false);
  const [run, setRun] = useState(0);
  const last = story.steps.length - 1;
  const done = step === last;

  // Auto-advance: strike the current word, then swap to the next one.
  useEffect(() => {
    if (!inView || done) return;
    const strike = window.setTimeout(() => setStriking(true), STEP_MS - 700);
    const next = window.setTimeout(() => {
      setStriking(false);
      setStep((s) => Math.min(s + 1, last));
    }, STEP_MS);
    return () => {
      window.clearTimeout(strike);
      window.clearTimeout(next);
    };
  }, [inView, step, done, last, run]);

  const replay = () => {
    setStriking(false);
    setStep(0);
    setRun((r) => r + 1);
  };

  const current = story.steps[step];
  // The phone's clock shows the most recent year reached so far.
  const year =
    story.steps
      .slice(0, step + 1)
      .reverse()
      .find((s) => /\d{4}$/.test(s.note))
      ?.note.slice(-4) ?? "";

  return (
    <section
      id="met"
      aria-labelledby="met-title"
      className="bg-charcoal-950 text-ivory-50 relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 40% at 70% 45%, rgba(207,178,124,0.10), transparent 70%), radial-gradient(50% 50% at 10% 100%, rgba(90,26,47,0.45), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-6">
          <p className="eyebrow text-gold-300">{story.eyebrow}</p>
          <h2 id="met-title" className="display-lg mt-6 text-balance">
            {story.headline}
          </h2>
          <p className="text-ivory-100/75 mt-6 max-w-md text-lg leading-relaxed text-pretty">
            {story.intro}
          </p>

          {/* The whole story, in order, for screen readers */}
          <ol className="sr-only">
            {story.steps.map((s) => (
              <li key={s.label}>
                {story.sender} {s.label}
                {s.note ? `, ${s.note}` : ""}
              </li>
            ))}
          </ol>

          {/* Progress: one mark per chapter of the word */}
          <div aria-hidden className="mt-12 flex items-center gap-2">
            {story.steps.map((s, i) => (
              <span
                key={s.label}
                className={cn(
                  "h-px transition-all duration-700 ease-(--ease-cinema)",
                  i <= step ? "bg-gold-300 w-10" : "bg-ivory-50/20 w-5",
                )}
              />
            ))}
          </div>
        </div>

        {/* The phone */}
        <div ref={ref} className="flex justify-center lg:col-span-6" aria-hidden>
          <div className="relative w-[min(78vw,20rem)]">
            <div className="bg-gold-300/10 absolute -inset-10 rounded-full blur-3xl" />
            <div className="border-ivory-50/15 from-wine-900 via-charcoal-950 to-charcoal-950 relative aspect-[9/19] rounded-[2.6rem] border bg-gradient-to-b p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
              <div className="bg-charcoal-950 absolute top-3 left-1/2 h-5 w-24 -translate-x-1/2 rounded-full" />
              <div className="flex h-full flex-col rounded-[2rem] bg-[radial-gradient(120%_60%_at_50%_0%,rgba(122,39,64,0.55),transparent_70%)] px-4 pt-16">
                <p className="font-display text-ivory-50/90 text-center text-6xl leading-none font-light lining-nums">
                  {year}
                </p>
                <p className="text-ivory-100/50 mt-2 text-center text-[0.65rem] tracking-[0.25em] uppercase">
                  {done ? "And every day since" : " "}
                </p>

                {/* the notification */}
                <m.div
                  className="border-ivory-50/10 bg-ivory-50/[0.07] mt-10 rounded-2xl border p-4 backdrop-blur-md"
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: duration.slow, ease: ease.cinema }}
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-gold-300/90 font-display text-wine-900 grid size-9 shrink-0 place-items-center rounded-full text-lg italic">
                      {her[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-ivory-100/55 text-[0.65rem] tracking-[0.18em] uppercase">
                        {story.sender}
                      </p>
                      <div className="relative mt-1 min-h-[3.2rem]">
                        <AnimatePresence initial={false}>
                          <m.p
                            key={`${run}-${step}`}
                            className={cn(
                              "font-display absolute top-0 left-0 text-[1.35rem] leading-snug",
                              done ? "text-gold-300 italic" : "text-ivory-50",
                            )}
                            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                            transition={{ duration: duration.base, ease: ease.cinema }}
                          >
                            {current.label}
                            {/* the gold strike-through */}
                            <m.span
                              className="bg-gold-300 absolute top-1/2 left-0 h-[2px] w-full origin-left"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: striking ? 1 : 0 }}
                              transition={{ duration: 0.55, ease: ease.cinema }}
                            />
                          </m.p>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                  {/* the picture in the message changes with the story */}
                  <div className="border-ivory-50/10 bg-charcoal-950 relative mt-4 aspect-[16/10] overflow-hidden rounded-xl border">
                    <AnimatePresence initial={false}>
                      {stepPhotos[step] && (
                        <m.div
                          key={`${run}-${step}-photo`}
                          className="absolute inset-0"
                          initial={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
                          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: duration.slow, ease: ease.cinema }}
                        >
                          <Photo photo={stepPhotos[step]!} fill decorative sizes="288px" />
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {current.note && (
                    <p className="border-ivory-50/10 text-ivory-100/45 mt-3 border-t pt-3 text-right text-[0.65rem] tracking-[0.2em] uppercase">
                      {current.note}
                    </p>
                  )}
                </m.div>

                <AnimatePresence>
                  {done && (
                    <m.p
                      className="font-hand text-gold-300 mt-auto mb-10 text-center text-4xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: duration.cinematic, ease: ease.cinema, delay: 0.4 }}
                    >
                      {story.outro}
                    </m.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-12 flex max-w-7xl justify-center px-5 lg:justify-end lg:px-12">
        <button
          type="button"
          onClick={replay}
          className={cn(
            "border-ivory-50/20 text-ivory-100/70 hover:border-gold-300 hover:text-gold-300 min-h-11 rounded-full border px-6 text-xs tracking-[0.22em] uppercase transition-all duration-500",
            done ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          tabIndex={done ? 0 : -1}
          aria-hidden={!done}
        >
          {story.replay}
        </button>
      </div>
    </section>
  );
}
