import { describe, expect, it } from "vitest";
import { content } from "@/content/anniversary";
import { photos } from "@/content/photos";
import { zonedTimeToUtc } from "@/lib/time";
import type { PhotoId } from "@/types/content";
import { FLOWERS, MIN_RADIUS } from "@/components/scenes/sunflowerLayout";

/** Guards against easy-to-make editing mistakes in the content files. */
describe("content integrity", () => {
  const referenced: PhotoId[] = [
    content.title.photo,
    content.title.photoMobile,
    content.future.photo,
    content.future.photoMobile,
    ...content.gallery.photos,
    ...content.polaroids.items.map((p) => p.photo),
    ...content.mountains.prints.map((p) => p.photo),
    ...content.beginning.chapters.flatMap((c) => (c.inset ? [c.inset] : [])),
    content.mountains.payoff.photo,
    ...content.stranger.steps.flatMap((s) => (s.photo ? [s.photo] : [])),
    ...content.beginning.chapters.flatMap((c) => (c.photo ? [c.photo] : [])),
    ...content.timeline.events.flatMap((e) => (e.photo ? [e.photo] : [])),
    ...content.littleThings.items.flatMap((i) => (i.photo ? [i.photo] : [])),
    ...(content.letter.photo ? [content.letter.photo] : []),
    ...(content.finale.photo ? [content.finale.photo] : []),
  ];

  it("every referenced photo exists in the library", () => {
    for (const id of referenced) expect(photos[id], id).toBeDefined();
  });

  it("every photo has meaningful alt text and a unique file", () => {
    const files = new Set<string>();
    for (const p of Object.values(photos)) {
      expect(p.alt.length, p.id).toBeGreaterThan(20);
      expect(files.has(p.file), p.file).toBe(false);
      files.add(p.file);
    }
  });

  it("the gallery has no duplicates", () => {
    expect(new Set(content.gallery.photos).size).toBe(content.gallery.photos.length);
  });

  it("ids are unique within each list", () => {
    const lists = [
      content.beginning.chapters,
      content.timeline.events,
      content.littleThings.items,
      content.future.dreams,
    ];
    for (const list of lists) {
      const ids = list.map((x) => x.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("timeline dates are valid and in order", () => {
    const dated = content.timeline.events.filter((e) => e.date).map((e) => e.date!);
    for (const d of dated) expect(zonedTimeToUtc(d, content.timeZone)).not.toBeNull();
    expect([...dated].sort()).toEqual(dated);
  });

  it("the key dates are the ones Sajan gave", () => {
    expect(content.weddingDate).toBe("2024-11-21");
    expect(content.anniversaryDate).toBe("2026-11-21");
    expect(content.timeline.events.find((e) => e.id === "engagement")?.date).toBe("2024-10-12");
    expect(content.timeline.events.find((e) => e.id === "first-date")?.date).toBe("2023-06-10");
  });

  it("the countdown target, if set, parses in its time zone", () => {
    const { target, timeZone } = content.future.countdown;
    if (target) expect(zonedTimeToUtc(target, timeZone)).not.toBeNull();
  });

  it("the stranger story ends on 'my wife'", () => {
    expect(content.stranger.steps[0].label).toBe("a stranger");
    expect(content.stranger.steps.at(-1)?.label).toBe("my wife");
  });

  it("the bouquet has exactly twelve sunflowers", () => {
    expect(FLOWERS).toHaveLength(12);
    const sizes = FLOWERS.map((f) => f.r);
    expect(Math.min(...sizes)).toBe(MIN_RADIUS);
    expect(new Set(sizes).size).toBeGreaterThan(8); // genuinely varied
    expect(content.bouquet.alt).toContain("twelve");
  });

  it("the letter opens with Dear Nuga and nothing is left marked as a draft", () => {
    expect(content.letter.salutation).toBe("Dear Nuga,");
    expect(JSON.stringify(content)).not.toContain('"draft"');
  });

  it("the letter is signed and the finale names her", () => {
    expect(content.letter.signature).toBe("Sajan");
    expect(content.finale.message.join(" ")).toContain(content.her);
  });
});
