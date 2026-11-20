"use client";

import { useNow } from "@/hooks/useNow";
import { durationBetween, pad2, zonedTimeToUtc } from "@/lib/time";
import type { Countdown as CountdownConfig } from "@/types/content";

/**
 * Countdown to the next reunion. Renders nothing unless a valid target is
 * configured, and nothing once the moment has passed. No date is ever invented.
 */
export function Countdown({ target, timeZone, label }: CountdownConfig) {
  const now = useNow();
  if (!target) return null;
  const at = zonedTimeToUtc(target, timeZone);
  if (at === null || now === null) return null;
  const d = durationBetween(now, at);
  if (d.past) return null;

  const cells: [string, string][] = [
    [String(d.days), "days"],
    [pad2(d.hours), "hours"],
    [pad2(d.minutes), "minutes"],
    [pad2(d.seconds), "seconds"],
  ];

  return (
    <div className="border-wine-700/15 mt-24 border-y py-12 text-center">
      <p className="eyebrow text-wine-600">{label}</p>
      <div aria-hidden className="mt-6 flex justify-center gap-5 sm:gap-10">
        {cells.map(([v, u]) => (
          <div key={u}>
            <div className="font-display text-wine-800 text-5xl font-light lining-nums tabular-nums sm:text-7xl">
              {v}
            </div>
            <div className="text-charcoal-500 mt-2 text-[0.65rem] tracking-[0.22em] uppercase">
              {u}
            </div>
          </div>
        ))}
      </div>
      <p className="sr-only">
        {d.days} days and {d.hours} hours to go.
      </p>
    </div>
  );
}
