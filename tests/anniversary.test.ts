import { describe, expect, it } from "vitest";
import { anniversaryNumber, ordinal } from "@/lib/anniversary";

const TZ = "Asia/Kathmandu";

describe("anniversary day", () => {
  it("is the 2nd anniversary on 21 Nov 2026 in Kathmandu", () => {
    // 21 Nov 2026 00:30 in Kathmandu = 20 Nov 2026 18:45 UTC
    expect(anniversaryNumber(Date.UTC(2026, 10, 20, 18, 45), "2024-11-21", TZ)).toBe(2);
  });

  it("is not the anniversary a few minutes earlier (still 20 Nov in Kathmandu)", () => {
    expect(anniversaryNumber(Date.UTC(2026, 10, 20, 18, 0), "2024-11-21", TZ)).toBeNull();
  });

  it("repeats every year and never fires on the wedding day itself", () => {
    expect(anniversaryNumber(Date.UTC(2027, 10, 21, 6), "2024-11-21", TZ)).toBe(3);
    expect(anniversaryNumber(Date.UTC(2024, 10, 21, 6), "2024-11-21", TZ)).toBeNull();
  });

  it("formats ordinals", () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22].map(ordinal)).toEqual([
      "1st",
      "2nd",
      "3rd",
      "4th",
      "11th",
      "12th",
      "13th",
      "21st",
      "22nd",
    ]);
  });
});
