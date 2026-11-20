"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, m } from "motion/react";
import { useId, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";
import { WISH_MAX } from "@/lib/wish";
import type { WishCopy } from "@/types/content";

const Particles = dynamic(() => import("@/components/motion/Particles"), { ssr: false });

type Status = "idle" | "sending" | "flying" | "sent" | "error";

/**
 * "Make a wish." She writes a wish; it's emailed to Sajan. On success the
 * words fold into a glowing paper lantern that drifts up into the night and
 * becomes a star, and only then the confirmation appears.
 */
export function Wish({ copy }: { copy: WishCopy }) {
  const [wish, setWish] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const fieldId = useId();
  const resultRef = useRef<HTMLHeadingElement | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending" || !wish.trim()) return;
    const honeypot = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)
      ?.value;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/wish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wish, website: honeypot ?? "" }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? copy.error);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setStatus(reduce ? "sent" : "flying");
      if (reduce) requestAnimationFrame(() => resultRef.current?.focus());
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : copy.error);
      setStatus("error");
    }
  };

  const landed = () => {
    setStatus("sent");
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const showForm = status === "idle" || status === "sending" || status === "error";

  return (
    <section
      id="wish"
      aria-labelledby="wish-title"
      className="to-wine-950 text-ivory-50 relative isolate overflow-hidden bg-gradient-to-b from-[#0d0b14] via-[#141022] py-24 sm:py-32 lg:py-40"
    >
      <Particles variant="stars" density={0.7} />
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="eyebrow text-gold-300">{copy.eyebrow}</p>
        <h2 id="wish-title" className="display-lg mt-6 text-balance">
          {copy.headline}
        </h2>
        <p className="text-ivory-100/75 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty">
          {copy.text}
        </p>

        <div className="relative mt-14 min-h-[22rem]">
          <AnimatePresence mode="wait">
            {showForm && (
              <m.form
                key="form"
                onSubmit={submit}
                noValidate
                className="mx-auto max-w-xl"
                exit={{ opacity: 0, scale: 0.6, y: -30, filter: "blur(6px)" }}
                transition={{ duration: duration.base, ease: ease.cinema }}
              >
                <label htmlFor={fieldId} className="sr-only">
                  {copy.label}
                </label>
                <textarea
                  id={fieldId}
                  name="wish"
                  value={wish}
                  onChange={(e) => setWish(e.target.value.slice(0, WISH_MAX))}
                  rows={5}
                  maxLength={WISH_MAX}
                  required
                  placeholder={copy.placeholder}
                  aria-describedby={`${fieldId}-count${error ? ` ${fieldId}-error` : ""}`}
                  className="border-gold-300/25 bg-ivory-50/[0.04] font-display text-ivory-50 placeholder:text-ivory-100/35 focus:border-gold-300/70 w-full resize-none rounded-2xl border p-5 text-xl leading-relaxed italic shadow-[inset_0_0_40px_rgba(227,207,164,0.05)] backdrop-blur-sm transition-colors focus:outline-none sm:text-2xl"
                />
                {/* honeypot: hidden from people, tempting to bots */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />
                <div className="text-ivory-100/45 mt-3 flex items-center justify-between gap-4 text-xs">
                  <span id={`${fieldId}-count`} aria-live="off">
                    {wish.length} / {WISH_MAX}
                  </span>
                  {error && (
                    <span id={`${fieldId}-error`} role="alert" className="text-rose-300">
                      {error}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === "sending" || !wish.trim()}
                  className={cn(
                    "border-gold-300/60 text-gold-300 mt-8 inline-flex min-h-12 items-center gap-3 rounded-full border px-8 text-sm tracking-[0.2em] uppercase transition-all duration-500",
                    "hover:bg-gold-300 hover:text-wine-950 disabled:hover:text-gold-300 hover:shadow-[0_0_40px_rgba(227,207,164,0.35)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none",
                  )}
                >
                  {status === "sending" ? copy.sending : copy.button}
                </button>
              </m.form>
            )}
          </AnimatePresence>

          {/* the lantern: rises, sways, shrinks into a star */}
          {status === "flying" && (
            <m.div
              aria-hidden
              className="pointer-events-none absolute bottom-10 left-1/2 -ml-10 w-20"
              initial={{ y: 0, opacity: 0, scale: 0.6 }}
              animate={{
                y: [0, -120, -260, -420],
                x: [0, 14, -12, 6],
                opacity: [0, 1, 1, 0],
                scale: [0.6, 1, 0.75, 0.15],
              }}
              transition={{ duration: 5.2, ease: "easeInOut", times: [0, 0.25, 0.65, 1] }}
              onAnimationComplete={landed}
            >
              <svg viewBox="0 0 80 110" className="w-full overflow-visible">
                <defs>
                  <radialGradient id="lantern-glow" cx="50%" cy="60%" r="60%">
                    <stop offset="0%" stopColor="#fff1c2" />
                    <stop offset="55%" stopColor="#f6b347" />
                    <stop offset="100%" stopColor="#c0622a" />
                  </radialGradient>
                </defs>
                <circle
                  cx="40"
                  cy="58"
                  r="52"
                  fill="#ffcf6b"
                  opacity="0.18"
                  className="lantern-flicker"
                />
                <path
                  d="M16 18 C 10 50, 14 82, 26 96 L54 96 C 66 82, 70 50, 64 18 Z"
                  fill="url(#lantern-glow)"
                />
                <path d="M16 18 Q 40 8 64 18" fill="none" stroke="#fbe3a6" strokeWidth="2" />
                <path
                  d="M30 18 C 28 50, 30 80, 34 96 M50 18 C 52 50, 50 80, 46 96"
                  stroke="#c97a2e"
                  strokeOpacity="0.35"
                  strokeWidth="1.2"
                  fill="none"
                />
                <ellipse cx="40" cy="98" rx="14" ry="3" fill="#7a3a16" />
                <circle cx="40" cy="104" r="3.2" fill="#fff6d6" className="lantern-flicker" />
              </svg>
            </m.div>
          )}

          <AnimatePresence>
            {status === "sent" && (
              <m.div
                key="sent"
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: duration.slow, ease: ease.cinema }}
              >
                {/* the new star */}
                <m.span
                  aria-hidden
                  className="bg-gold-300 block size-3 rounded-full shadow-[0_0_24px_8px_rgba(255,214,120,0.6)]"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.8, 1] }}
                  transition={{ duration: 1.2, ease: ease.cinema }}
                />
                <h3
                  ref={resultRef}
                  tabIndex={-1}
                  className="display-md mt-10 text-balance outline-none"
                  role="status"
                >
                  {copy.sentHeadline}
                </h3>
                <p className="font-hand text-gold-300 mx-auto mt-4 max-w-md text-3xl sm:text-4xl">
                  {copy.sentText}
                </p>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
