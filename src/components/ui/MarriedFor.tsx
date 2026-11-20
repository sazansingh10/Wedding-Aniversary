"use client";

import { useNow } from "@/hooks/useNow";
import { durationBetween, pad2, zonedTimeToUtc } from "@/lib/time";

/** A quietly ticking "married for" counter, measured from the wedding day in her time zone. */
export function MarriedFor({ since, timeZone }: { since: string; timeZone: string }) {
  const now = useNow();
  const start = zonedTimeToUtc(since, timeZone);
  if (start === null) return null;
  const d = now === null ? null : durationBetween(start, now);

  const cells: [string, string][] = d
    ? [
        [d.days.toLocaleString("en-GB"), "days"],
        [pad2(d.hours), "hours"],
        [pad2(d.minutes), "minutes"],
        [pad2(d.seconds), "seconds"],
      ]
    : [
        ["—", "days"],
        ["—", "hours"],
        ["—", "minutes"],
        ["—", "seconds"],
      ];

  return (
    <div>
      <p className="eyebrow text-ivory-100/60">Married for</p>
      {/* Visual ticker is hidden from AT; a calmer summary is announced instead. */}
      <div aria-hidden className="font-display text-ivory-50 mt-3 flex gap-4 sm:gap-6">
        {cells.map(([value, unit]) => (
          <div key={unit} className="min-w-[2.6ch] text-center">
            <div className="text-3xl leading-none font-light lining-nums tabular-nums sm:text-4xl">
              {value}
            </div>
            <div className="text-ivory-100/55 mt-2 font-sans text-[0.6rem] tracking-[0.22em] uppercase">
              {unit}
            </div>
          </div>
        ))}
      </div>
      <p className="sr-only">
        {d ? `Married for ${d.days} days.` : "Married since 21 November 2024."}
      </p>
    </div>
  );
}
