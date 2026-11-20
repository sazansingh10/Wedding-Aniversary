/**
 * Small, dependency-free time helpers. Pure functions so they can be unit tested.
 */

export interface Duration {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** true when `to` is not after `from`. */
  past: boolean;
}

/** Offset (ms) of `timeZone` from UTC at the given instant. */
export function timeZoneOffset(instant: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts: Record<string, number> = {};
  for (const p of dtf.formatToParts(new Date(instant))) {
    if (p.type !== "literal") parts[p.type] = Number(p.value);
  }
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return asUtc - Math.floor(instant / 1000) * 1000;
}

const WALL_TIME = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/;

/**
 * Converts a wall-clock time in a given IANA zone ("2027-01-15T18:00", "Asia/Kathmandu")
 * to a UTC epoch in milliseconds. Returns null for malformed input or an unknown zone.
 */
export function zonedTimeToUtc(wallTime: string, timeZone: string): number | null {
  const m = WALL_TIME.exec(wallTime.trim());
  if (!m) return null;
  const [, y, mo, d, h = "0", mi = "0", s = "0"] = m;
  const guess = Date.UTC(+y, +mo - 1, +d, +h, +mi, +s);
  if (Number.isNaN(guess)) return null;
  try {
    // Two passes handle instants that straddle a DST change.
    const first = guess - timeZoneOffset(guess, timeZone);
    return guess - timeZoneOffset(first, timeZone);
  } catch {
    return null;
  }
}

export function durationBetween(from: number, to: number): Duration {
  const past = to <= from;
  let total = Math.max(0, Math.floor((to - from) / 1000));
  const days = Math.floor(total / 86400);
  total -= days * 86400;
  const hours = Math.floor(total / 3600);
  total -= hours * 3600;
  const minutes = Math.floor(total / 60);
  const seconds = total - minutes * 60;
  return { days, hours, minutes, seconds, past };
}

/** "21 November 2024" style, rendered identically on server and client. */
export function formatLongDate(isoDate: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return isoDate;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[1]}`;
}

export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}
