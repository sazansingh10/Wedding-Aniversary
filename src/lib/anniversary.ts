/** Pure helpers for "is today the day?", unit tested. */

/** Month and day of `instant` in the given IANA time zone. */
export function monthDayIn(
  instant: number,
  timeZone: string,
): { month: number; day: number; year: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date(instant));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/**
 * If `instant` falls on the wedding anniversary (same month and day, in the
 * couple's time zone, any year after the wedding), returns which anniversary
 * it is (1, 2, 3, ...). Otherwise null.
 */
export function anniversaryNumber(
  instant: number,
  weddingDate: string,
  timeZone: string,
): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(weddingDate);
  if (!m) return null;
  const today = monthDayIn(instant, timeZone);
  if (today.month !== Number(m[2]) || today.day !== Number(m[3])) return null;
  const n = today.year - Number(m[1]);
  return n >= 1 ? n : null;
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}
