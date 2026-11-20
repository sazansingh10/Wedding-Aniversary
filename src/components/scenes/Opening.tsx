"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useNow } from "@/hooks/useNow";
import { useSessionFlag } from "@/hooks/useSessionFlag";
import { anniversaryNumber, ordinal } from "@/lib/anniversary";
import { cn } from "@/lib/cn";

const Particles = dynamic(() => import("@/components/motion/Particles"), { ssr: false });

interface OpeningProps {
  kicker: string;
  line: string;
  button: string;
  anniversaryGreeting: string;
  weddingDate: string;
  timeZone: string;
  her: string;
  him: string;
}

type Phase = "idle" | "opening" | "leaving" | "done";

/**
 * Scene 1. A sealed envelope on a dark, candle-lit stage. Text and envelope are
 * animated with CSS (not JS) so the first paint is fast and never waits on a bundle.
 */
export function Opening({
  kicker,
  line,
  button,
  anniversaryGreeting,
  weddingDate,
  timeZone,
  her,
  him,
}: OpeningProps) {
  const [seen, setSeen] = useSessionFlag("tyof:opened");
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<number[]>([]);
  const done = seen || phase === "done";

  // Anniversary-day welcome: only on the day itself (her time zone), or with
  // ?anniversary in the URL to preview it. Client-only, so no hydration mismatch.
  const now = useNow();
  const preview = now !== null && new URLSearchParams(window.location.search).has("anniversary");
  const nth =
    now === null
      ? null
      : (anniversaryNumber(now, weddingDate, timeZone) ??
        (preview
          ? Math.max(1, new Date(now).getFullYear() - Number(weddingDate.slice(0, 4)))
          : null));
  const showered = useRef(false);
  useEffect(() => {
    if (nth === null || done || showered.current) return;
    showered.current = true;
    void import("@/lib/petalShower").then((mod) => mod.petalShower());
  }, [nth, done]);

  // While the gate is up: lock scroll and make the story inert behind it.
  useEffect(() => {
    const story = document.getElementById("story");
    if (done) {
      document.documentElement.style.overflow = "";
      if (story) story.inert = false;
      return;
    }
    document.documentElement.style.overflow = "hidden";
    if (story) story.inert = true;
    return () => {
      document.documentElement.style.overflow = "";
      if (story) story.inert = false;
    };
  }, [done]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const finish = () => {
    setPhase("done");
    setSeen(true);
    window.scrollTo({ top: 0 });
    // Hand focus to the title so keyboard and screen reader users land in the story.
    requestAnimationFrame(() =>
      document.getElementById("story-start")?.focus({ preventScroll: true }),
    );
  };

  const open = () => {
    if (phase !== "idle") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      finish();
      return;
    }
    setPhase("opening");
    timers.current.push(window.setTimeout(() => setPhase("leaving"), 1700));
    timers.current.push(window.setTimeout(finish, 2700));
  };

  if (done) return null;

  const opened = phase !== "idle";

  return (
    <div
      data-gate
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-line"
      className={cn(
        "bg-wine-950 fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-4 text-center transition-[opacity,transform,filter] duration-[1000ms] ease-(--ease-cinema)",
        phase === "leaving" && "pointer-events-none scale-[1.04] opacity-0 blur-sm",
      )}
    >
      {/* Light: a warm glow above, a deeper vignette below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 38%, rgba(207,178,124,0.20), transparent 70%), radial-gradient(120% 80% at 50% 120%, rgba(122,39,64,0.55), transparent 60%)",
        }}
      />
      <Particles variant="motes" density={0.8} />

      {nth !== null && (
        <p className="rise font-hand text-gold-300 relative mb-6 text-[clamp(2.2rem,7vw,3.6rem)] leading-none">
          {anniversaryGreeting.replace("{nth}", ordinal(nth))}
        </p>
      )}
      <p className="rise eyebrow text-gold-300 relative" style={{ animationDelay: "300ms" }}>
        {kicker}
      </p>

      {/* The envelope */}
      <div
        className="rise relative my-10 w-[min(78vw,340px)] [perspective:1200px] sm:my-12"
        style={{ animationDelay: "700ms" }}
        aria-hidden
      >
        <div className="relative aspect-[3/2] w-full">
          {/* back panel */}
          <div className="from-ivory-200 absolute inset-0 rounded-[3px] bg-gradient-to-b to-[#d8c7ad] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]" />
          {/* letter */}
          <div
            className={cn(
              "bg-ivory-50 absolute inset-x-[7%] top-[8%] bottom-[6%] flex flex-col items-center justify-center rounded-[2px] shadow-sm transition-transform duration-[1100ms] ease-(--ease-cinema)",
              opened ? "-translate-y-[58%] delay-[450ms]" : "translate-y-0",
            )}
          >
            <span className="font-hand text-wine-700 text-[clamp(1.8rem,7vw,2.6rem)] leading-none">
              {her}
            </span>
            <span className="eyebrow text-wine-600/70 mt-2 text-[0.55rem]">21 · XI · MMXXVI</span>
          </div>
          {/* side flaps and bottom pocket, in front of the letter */}
          <div
            className="absolute inset-0 rounded-l-[3px]"
            style={{
              clipPath: "polygon(0 0, 52% 58%, 0 100%)",
              background: "linear-gradient(90deg, #e6d7bf, #efe4d1)",
            }}
          />
          <div
            className="absolute inset-0 rounded-r-[3px]"
            style={{
              clipPath: "polygon(100% 0, 48% 58%, 100% 100%)",
              background: "linear-gradient(270deg, #e6d7bf, #efe4d1)",
            }}
          />
          <div
            className="absolute inset-0 rounded-b-[3px] shadow-[0_-1px_0_rgba(90,26,47,0.08)]"
            style={{
              clipPath: "polygon(0 100%, 50% 52%, 100% 100%)",
              background: "linear-gradient(to top, #e9dcc8, #f3eadc)",
            }}
          />
          {/* flap */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-[72%] origin-top transition-transform duration-[900ms] ease-(--ease-cinema) [backface-visibility:hidden]",
              opened ? "[transform:rotateX(180deg)]" : "[transform:rotateX(0deg)]",
              opened ? "z-0" : "z-10",
            )}
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: "linear-gradient(to bottom, #efe3cf, #dccbb0)",
            }}
          />
          {/* wax seal */}
          <div
            className={cn(
              "absolute top-[62%] left-1/2 z-20 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-all duration-500 sm:size-16",
              opened && "scale-75 opacity-0",
            )}
            style={{
              background: "radial-gradient(circle at 35% 30%, #8d3049, #5a1a2f 60%, #3a111f)",
              boxShadow: "0 2px 0 rgba(255,255,255,0.12) inset, 0 6px 14px rgba(0,0,0,0.35)",
            }}
          >
            <span className="font-display text-gold-300 text-lg italic sm:text-xl">
              {her[0]}&thinsp;&amp;&thinsp;{him[0]}
            </span>
          </div>
        </div>
      </div>

      <h1
        id="gate-line"
        className="rise font-display text-ivory-50 relative max-w-[20ch] text-[clamp(1.75rem,6vw,3.25rem)] leading-tight font-light text-balance italic"
        style={{ animationDelay: "1400ms" }}
      >
        {line}
      </h1>

      <button
        type="button"
        onClick={open}
        disabled={opened}
        className="rise group border-gold-400/50 text-gold-300 hover:border-gold-300 hover:bg-gold-300/10 hover:text-ivory-50 relative mt-10 inline-flex min-h-12 items-center gap-3 rounded-full border px-7 py-3 text-sm tracking-[0.18em] uppercase transition-colors duration-500 disabled:opacity-60"
        style={{ animationDelay: "2100ms" }}
      >
        {button}
        <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
          →
        </span>
      </button>
    </div>
  );
}
