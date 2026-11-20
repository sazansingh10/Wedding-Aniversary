import { describe, expect, it } from "vitest";
import { durationBetween, formatLongDate, pad2, zonedTimeToUtc } from "@/lib/time";

describe("zonedTimeToUtc", () => {
  it("converts Kathmandu wall time (UTC+5:45) to UTC", () => {
    expect(zonedTimeToUtc("2024-11-21T00:00", "Asia/Kathmandu")).toBe(
      Date.UTC(2024, 10, 20, 18, 15),
    );
  });

  it("accepts a bare date as midnight", () => {
    expect(zonedTimeToUtc("2024-11-21", "UTC")).toBe(Date.UTC(2024, 10, 21));
  });

  it("handles a zone with daylight saving (London summer = UTC+1)", () => {
    expect(zonedTimeToUtc("2027-07-01T12:00", "Europe/London")).toBe(Date.UTC(2027, 6, 1, 11));
  });

  it("returns null for malformed input or an unknown zone", () => {
    expect(zonedTimeToUtc("next tuesday", "UTC")).toBeNull();
    expect(zonedTimeToUtc("2027-01-01", "Not/AZone")).toBeNull();
  });
});

describe("durationBetween", () => {
  it("splits a span into days/hours/minutes/seconds", () => {
    const from = Date.UTC(2024, 0, 1);
    const to = from + ((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000;
    expect(durationBetween(from, to)).toEqual({
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
      past: false,
    });
  });

  it("clamps to zero and flags the past", () => {
    const d = durationBetween(1000, 0);
    expect(d.past).toBe(true);
    expect(d.days + d.hours + d.minutes + d.seconds).toBe(0);
  });

  it("counts 730 days from the wedding to the second anniversary", () => {
    const wed = zonedTimeToUtc("2024-11-21", "Asia/Kathmandu")!;
    const anniv = zonedTimeToUtc("2026-11-21", "Asia/Kathmandu")!;
    expect(durationBetween(wed, anniv).days).toBe(730);
  });
});

describe("formatting", () => {
  it("formats long dates deterministically", () => {
    expect(formatLongDate("2024-10-12")).toBe("12 October 2024");
    expect(formatLongDate("oops")).toBe("oops");
  });
  it("pads", () => {
    expect(pad2(3)).toBe("03");
    expect(pad2(12)).toBe("12");
  });
});
