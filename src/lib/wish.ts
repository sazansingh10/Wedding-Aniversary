/**
 * Validation and formatting for the wish form. Pure functions, unit tested,
 * shared by the API route. The wish is only ever sent as plain text, never
 * rendered as HTML anywhere, so there is no markup to escape.
 */

export const WISH_MAX = 1000;

export type WishResult = { ok: true; wish: string } | { ok: false; error: string };

/** Accepts the parsed JSON body of a wish request. */
export function validateWish(body: unknown): WishResult {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Invalid request." };
  const { wish, website } = body as { wish?: unknown; website?: unknown };
  // Honeypot: a hidden field real visitors never fill in.
  if (typeof website === "string" && website.trim() !== "")
    return { ok: false, error: "Invalid request." };
  if (typeof wish !== "string") return { ok: false, error: "Please write a wish first." };
  const clean = wish
    // drop control characters except newlines and tabs
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    .trim();
  if (clean.length === 0) return { ok: false, error: "Please write a wish first." };
  if (clean.length > WISH_MAX)
    return { ok: false, error: `Please keep it under ${WISH_MAX} characters.` };
  return { ok: true, wish: clean };
}

/** Plain-text email body. */
export function formatWishEmail(wish: string, sentAt: Date, timeZone: string, her: string): string {
  const when = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    dateStyle: "full",
    timeStyle: "short",
  }).format(sentAt);
  return `${her} made a wish on your anniversary site.\n\n"${wish}"\n\nSent ${when} (${timeZone}).\n`;
}

/**
 * Tiny in-memory rate limiter: `limit` requests per `windowMs` per key.
 * Good enough for one private page. On serverless hosts each instance keeps
 * its own memory, so this is a speed bump, not a guarantee.
 */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()): boolean => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 500) {
      for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
    return true;
  };
}

/**
 * Works out the Resend key and recipient from the environment, tolerating a
 * common setup slip: pasting the API key into WISH_TO_EMAIL instead of adding
 * RESEND_API_KEY. A value starting with "re_" is always treated as a key, and
 * the recipient falls back to `defaultTo` (server-side only).
 */
export function resolveWishConfig(
  env: { RESEND_API_KEY?: string; WISH_TO_EMAIL?: string },
  defaultTo: string,
): { apiKey: string | null; to: string } {
  const key = env.RESEND_API_KEY?.trim();
  const toRaw = env.WISH_TO_EMAIL?.trim();
  const toIsKey = !!toRaw && toRaw.startsWith("re_");
  const apiKey = key && key.startsWith("re_") ? key : toIsKey ? toRaw : key || null;
  const to = toRaw && !toIsKey && toRaw.includes("@") ? toRaw : defaultTo;
  return { apiKey: apiKey ?? null, to };
}
