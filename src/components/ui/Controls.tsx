"use client";

import { useEffect, useRef, useState } from "react";
import type { AmbientHandle } from "@/lib/ambient";
import { cn } from "@/lib/cn";
import { musicBus } from "@/lib/musicBus";

interface ControlsProps {
  musicSrc: string | null;
  musicTitle: string;
  chapters: { id: string; label: string }[];
}

/**
 * Two quiet floating controls: an optional music toggle (never autoplays)
 * and a chapter menu for jumping around the story.
 */
export function Controls({ musicSrc, musicTitle, chapters }: ControlsProps) {
  return (
    <div className="fixed right-3 bottom-3 z-40 flex items-center gap-2 sm:right-5 sm:bottom-5">
      <MusicToggle src={musicSrc} title={musicTitle} />
      <ChapterMenu chapters={chapters} />
    </div>
  );
}

const pill =
  "grid size-12 place-items-center rounded-full border border-gold-300/30 bg-wine-950/70 text-gold-300 shadow-lg backdrop-blur-md transition-colors hover:border-gold-300/70 hover:text-ivory-50";

function MusicToggle({ src, title }: { src: string | null; title: string }) {
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const ambient = useRef<AmbientHandle | null>(null);

  useEffect(
    () => () => {
      audio.current?.pause();
      void ambient.current?.stop();
    },
    [],
  );

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (playing) {
        if (audio.current) audio.current.pause();
        if (ambient.current) {
          const a = ambient.current;
          ambient.current = null;
          musicBus.set(null);
          await a.stop();
        }
        setPlaying(false);
      } else {
        if (src) {
          audio.current ??= Object.assign(new Audio(src), { loop: true, volume: 0.6 });
          await audio.current.play();
        } else {
          const { startAmbient } = await import("@/lib/ambient");
          ambient.current = await startAmbient();
          musicBus.set(ambient.current);
        }
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? `Pause music: ${title}` : `Play music: ${title}`}
      className={pill}
    >
      <span aria-hidden className="flex h-4 items-end gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn("w-[2px] rounded-full bg-current", playing ? "animate-shimmer" : "")}
            style={{
              height: playing ? `${[60, 100, 45, 80][i]}%` : "30%",
              animationDelay: `${i * 0.35}s`,
              transition: "height 600ms",
            }}
          />
        ))}
      </span>
    </button>
  );
}

function ChapterMenu({ chapters }: { chapters: { id: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement | null>(null);
  const button = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="chapter-menu"
        aria-label="Chapters"
        onClick={() => setOpen((o) => !o)}
        className={pill}
      >
        <span aria-hidden className="flex flex-col gap-[5px]">
          <span
            className={cn(
              "block h-px w-4 bg-current transition-transform",
              open && "translate-y-[3px] rotate-45",
            )}
          />
          <span
            className={cn(
              "block h-px w-4 bg-current transition-transform",
              open && "-translate-y-[3px] -rotate-45",
            )}
          />
        </span>
      </button>
      <nav
        id="chapter-menu"
        aria-label="Chapters"
        hidden={!open}
        className="border-gold-300/20 bg-wine-950/95 absolute right-0 bottom-14 w-60 rounded-2xl border p-2 shadow-2xl backdrop-blur-md"
      >
        <ol>
          {chapters.map((c, i) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                onClick={() => setOpen(false)}
                className="text-ivory-100/85 hover:bg-ivory-50/5 hover:text-gold-300 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm"
              >
                <span aria-hidden className="font-display text-gold-300/70 w-5 italic">
                  {i + 1}
                </span>
                {c.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
