import { content } from "@/content/anniversary";
import { createRateLimiter, formatWishEmail, resolveWishConfig, validateWish } from "@/lib/wish";

// Server-only fallback recipient (this file never ships to the browser).
const DEFAULT_TO = "sazansingh10@gmail.com";

/**
 * POST /api/wish: emails Neela's wish to Sajan.
 *
 * Configuration (server-side environment variables, never sent to the browser):
 *   RESEND_API_KEY   API key from resend.com (free tier is plenty)
 *   WISH_TO_EMAIL    where wishes are delivered
 *   WISH_FROM_EMAIL  optional; defaults to Resend's shared test sender, which
 *                    can deliver only to the email your Resend account uses
 *
 * In `next dev` with no API key, the wish is printed to the server console
 * instead, so the whole flow can be tried without sending real email.
 */

const allow = createRateLimiter(5, 10 * 60 * 1000);
const MAX_BODY = 8_000;

const json = (status: number, body: Record<string, unknown>) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  // Same-origin only: browsers always send Origin on cross-site POSTs.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return json(403, { error: "Not allowed." });
  }
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return json(415, { error: "Invalid request." });
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "local";
  if (!allow(ip)) {
    return json(429, { error: "That's a lot of wishes! Wait a few minutes, then try again." });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { error: "That wish is too long." });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: "Invalid request." });
  }
  const result = validateWish(body);
  if (!result.ok) return json(400, { error: result.error });

  const text = formatWishEmail(result.wish, new Date(), content.timeZone, content.her);
  const { apiKey, to } = resolveWishConfig(
    { RESEND_API_KEY: process.env.RESEND_API_KEY, WISH_TO_EMAIL: process.env.WISH_TO_EMAIL },
    DEFAULT_TO,
  );

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("\n[wish] (dev, not emailed: set RESEND_API_KEY and WISH_TO_EMAIL)\n" + text);
      return json(200, { ok: true, dev: true });
    }
    console.error("[wish] RESEND_API_KEY or WISH_TO_EMAIL is not set");
    return json(503, { error: "Wishes can't be sent right now. Please try again later." });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.WISH_FROM_EMAIL ?? "Anniversary wishes <onboarding@resend.dev>",
        to: [to],
        subject: `A wish from ${content.her} 🌻`,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[wish] email provider responded", res.status);
      return json(502, { error: "It didn't send. Please try again in a moment." });
    }
  } catch (err) {
    console.error("[wish] email request failed", err instanceof Error ? err.message : err);
    return json(502, { error: "It didn't send. Please try again in a moment." });
  }
  return json(200, { ok: true });
}
