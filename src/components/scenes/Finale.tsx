"use client";

import dynamic from "next/dynamic";
import { m } from "motion/react";
import { useRef, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { musicBus } from "@/lib/musicBus";
import { Reveal } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import type { Finale as FinaleContent, ResolvedPhoto } from "@/types/content";

const Particles = dynamic(() => import("@/components/motion/Particles"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Scene 7. The page drains to near-black and slows down. Three lines, one
 * sentence, one button. Then: stars, a warm glow, the photograph, the message.
 */
export function Finale({ finale, photo }: { finale: FinaleContent; photo?: ResolvedPhoto }) {
  const [revealed, setRevealed] = useState(false);
  const messageRef = useRef<HTMLSpanElement | null>(null);

  const reveal = () => {
    setRevealed(true);
    // The final touch: petals fall across the screen, and if the lullaby is
    // playing it answers with a soft closing chime.
    musicBus.chime();
    void import("@/lib/petalShower").then((mod) => mod.petalShower(7500));
    requestAnimationFrame(() => {
      messageRef.current?.focus({ preventScroll: true });
      messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <section
      id="finale"
      aria-labelledby="finale-title"
      className="bg-charcoal-950 text-ivory-50 relative overflow-hidden"
    >
      {/* the fade from the ivory page into night */}
      <div
        aria-hidden
        className="from-ivory-50 via-wine-900 to-charcoal-950 h-[40vh] bg-gradient-to-b"
      />

      <h2 id="finale-title" className="sr-only">
        One last thing
      </h2>

      <div className="mx-auto flex min-h-[90svh] max-w-4xl flex-col items-center justify-center px-5 py-24 text-center">
        <div className="space-y-6 sm:space-y-8">
          {finale.lines.map((line, i) => (
            <Reveal key={i} delay={i * 0.35}>
              <p className="font-display text-ivory-100/80 text-[clamp(1.5rem,3.4vw+0.6rem,3rem)] leading-tight font-light italic">
                {line}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4} className="mt-16 sm:mt-24">
          <p className="display-lg text-gold-300 text-balance">{finale.choose}</p>
        </Reveal>

        {!revealed && (
          <Reveal delay={0.6} className="mt-16">
            <Magnetic>
              <button
                type="button"
                onClick={reveal}
                className="group border-ivory-50/30 text-ivory-50 hover:border-gold-300 hover:text-gold-300 inline-flex min-h-12 items-center gap-3 rounded-full border px-8 py-3 text-sm tracking-[0.2em] uppercase transition-all duration-700 hover:shadow-[0_0_40px_rgba(227,207,164,0.25)]"
              >
                {finale.buttonLabel}
              </button>
            </Magnetic>
          </Reveal>
        )}
      </div>

      {revealed && (
        <div className="relative isolate flex min-h-svh flex-col items-center justify-center px-5 pt-10 pb-28 text-center">
          <Particles variant="stars" density={1.2} />
          <m.div
            aria-hidden
            className="pointer-events-none absolute top-1/3 left-1/2 -z-10 size-[min(120vw,60rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(227,207,164,0.22), rgba(122,39,64,0.18) 40%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 3, ease }}
          />

          {photo && (
            <m.div
              className="border-gold-300/40 relative w-[min(62vw,19rem)] overflow-hidden rounded-t-full border p-1.5"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 2, ease, delay: 0.3 }}
            >
              <div className="overflow-hidden rounded-t-full">
                <Photo photo={photo} ratio="3 / 4" sizes="304px" />
              </div>
            </m.div>
          )}

          <div className="mt-12 space-y-3" aria-live="polite">
            {finale.message.map((line, i) => {
              const isFirst = i === 0;
              const isLast = i === finale.message.length - 1;
              return (
                <m.p
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.4, ease, delay: 1.2 + i * 0.9 }}
                  className={
                    isFirst
                      ? "font-display text-ivory-50 text-[clamp(1.8rem,4vw+0.6rem,3.4rem)] leading-tight"
                      : isLast
                        ? "font-hand text-gold-300 pt-4 text-[clamp(2.8rem,6vw+1rem,5rem)] leading-none"
                        : "font-display text-ivory-100/85 text-[clamp(1.3rem,2vw+0.6rem,2rem)] italic"
                  }
                >
                  {isFirst ? (
                    <span ref={messageRef} tabIndex={-1} className="outline-none">
                      {line}
                    </span>
                  ) : (
                    line
                  )}
                </m.p>
              );
            })}
          </div>

          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 + finale.message.length * 0.9 + 0.4 }}
            className="eyebrow text-ivory-100/50 mt-10"
          >
            — {finale.signature}
          </m.p>

          <m.a
            href="#top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 + finale.message.length * 0.9 + 1.4 }}
            className="text-ivory-100/50 hover:text-gold-300 mt-16 inline-flex min-h-11 items-center text-xs tracking-[0.25em] uppercase underline-offset-8 hover:underline"
          >
            Start again from the beginning
          </m.a>
        </div>
      )}
    </section>
  );
}
