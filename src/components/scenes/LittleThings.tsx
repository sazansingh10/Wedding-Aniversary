"use client";

import { AnimatePresence, m } from "motion/react";
import { useId, useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";
import type { LittleThing, PhotoId, ResolvedPhoto } from "@/types/content";

interface LittleThingsProps {
  headline: string;
  intro: string;
  items: LittleThing[];
  photos: Record<PhotoId, ResolvedPhoto>;
}

/**
 * Scene 4. A typographic list rather than a grid of cards. Choosing a line
 * reveals its message: inline beneath it on small screens, and in a framed
 * photograph panel beside the list on large ones.
 */
export function LittleThings({ headline, intro, items, photos }: LittleThingsProps) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);
  const baseId = useId();
  const current = items.find((it) => it.id === active) ?? null;
  const currentPhoto = current?.photo ? photos[current.photo] : undefined;

  return (
    <section
      id="little-things"
      aria-labelledby="little-title"
      className="bg-wine-900 text-ivory-50 relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 85% 10%, rgba(207,178,124,0.12), transparent 70%), radial-gradient(60% 50% at 0% 100%, rgba(122,39,64,0.5), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-gold-300">Chapter three · The little things</p>
          <h2 id="little-title" className="display-lg mt-6 text-balance">
            {headline}
          </h2>
          <p className="text-ivory-100/75 mt-6 max-w-lg text-lg leading-relaxed text-pretty">
            {intro}
          </p>

          <ul className="border-ivory-50/10 mt-14 border-t">
            {items.map((it, i) => {
              const isOpen = it.id === active;
              const panelId = `${baseId}-${it.id}`;
              return (
                <li key={it.id} className="border-ivory-50/10 border-b">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setActive(isOpen ? null : it.id)}
                    className="group flex min-h-16 w-full items-baseline gap-5 py-5 text-left sm:gap-7"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "w-7 shrink-0 font-sans text-xs tabular-nums transition-colors duration-500",
                        isOpen ? "text-gold-300" : "text-ivory-100/40",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display flex-1 text-[clamp(1.4rem,2.4vw+0.8rem,2.4rem)] leading-tight transition-all duration-700 ease-(--ease-cinema)",
                        isOpen
                          ? "text-gold-300 translate-x-1 italic"
                          : "text-ivory-50/85 group-hover:text-ivory-50 group-hover:translate-x-1",
                      )}
                    >
                      {it.title}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "text-gold-300 shrink-0 text-lg transition-transform duration-500",
                        isOpen ? "rotate-45" : "rotate-0",
                      )}
                    >
                      +
                    </span>
                  </button>
                  {/* Inline message on small screens; on large screens it stays
                      available to screen readers while the photo panel shows it visually. */}
                  <div
                    id={panelId}
                    role="region"
                    aria-label={it.title}
                    hidden={!isOpen}
                    className="lg:sr-only"
                  >
                    <p className="font-display text-ivory-100/90 pb-7 pl-12 text-xl leading-relaxed italic sm:pl-14">
                      {it.message}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Framed panel on large screens */}
        <div aria-hidden className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-24">
            <div className="relative">
              <div className="border-gold-400/30 absolute -inset-4 border" />
              <div className="bg-wine-950 relative aspect-[4/5] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <m.div
                    key={current?.id ?? "none"}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {currentPhoto ? (
                      <Photo photo={currentPhoto} fill decorative sizes="40vw" />
                    ) : (
                      <div className="photo-placeholder absolute inset-0" />
                    )}
                    <div className="from-wine-950 via-wine-950/30 absolute inset-0 bg-gradient-to-t to-transparent" />
                    <p className="font-display text-ivory-50 absolute right-8 bottom-8 left-8 text-2xl leading-snug italic xl:text-[1.75rem]">
                      {current?.message ?? "Choose one."}
                    </p>
                  </m.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
