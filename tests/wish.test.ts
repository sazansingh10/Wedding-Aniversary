import { describe, expect, it } from "vitest";
import { createRateLimiter, formatWishEmail, validateWish, WISH_MAX } from "@/lib/wish";

describe("validateWish", () => {
  it("accepts and trims a normal wish", () => {
    expect(validateWish({ wish: "  More momo dates  " })).toEqual({
      ok: true,
      wish: "More momo dates",
    });
  });
  it("rejects empty, non-string and oversized wishes", () => {
    expect(validateWish({ wish: "   " }).ok).toBe(false);
    expect(validateWish({ wish: 42 }).ok).toBe(false);
    expect(validateWish(null).ok).toBe(false);
    expect(validateWish({ wish: "a".repeat(WISH_MAX + 1) }).ok).toBe(false);
  });
  it("rejects bots that fill the honeypot", () => {
    expect(validateWish({ wish: "hi", website: "spam.example" }).ok).toBe(false);
  });
  it("strips control characters but keeps line breaks", () => {
    expect(validateWish({ wish: "one\u0000\r\ntwo" })).toEqual({ ok: true, wish: "one\ntwo" });
  });
});

describe("formatWishEmail", () => {
  it("includes the wish and the time in her zone", () => {
    const t = formatWishEmail(
      "A trip to the mountains",
      new Date(Date.UTC(2026, 10, 21, 6)),
      "Asia/Kathmandu",
      "Neela",
    );
    expect(t).toContain('"A trip to the mountains"');
    expect(t).toContain("Neela");
    expect(t).toContain("Asia/Kathmandu");
  });
});

describe("createRateLimiter", () => {
  it("allows up to the limit within the window, then blocks, then recovers", () => {
    const allow = createRateLimiter(2, 1000);
    expect(allow("a", 0)).toBe(true);
    expect(allow("a", 10)).toBe(true);
    expect(allow("a", 20)).toBe(false);
    expect(allow("b", 20)).toBe(true);
    expect(allow("a", 1500)).toBe(true);
  });
});
