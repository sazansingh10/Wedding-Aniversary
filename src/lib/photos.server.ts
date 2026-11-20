import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { photos } from "@/content/photos";
import type { PhotoId, ResolvedPhoto } from "@/types/content";

const PHOTO_DIR = path.join(process.cwd(), "public", "photos");

/**
 * Checks once, at build/render time on the server, which photo files exist.
 * Missing files resolve to `src: null` so the UI can show a placeholder
 * instead of a broken image.
 */
export function resolvePhotos(): Record<PhotoId, ResolvedPhoto> {
  const out = {} as Record<PhotoId, ResolvedPhoto>;
  for (const [id, photo] of Object.entries(photos) as [PhotoId, (typeof photos)[PhotoId]][]) {
    const exists = existsSync(path.join(PHOTO_DIR, photo.file));
    out[id] = { ...photo, src: exists ? `/photos/${photo.file}` : null };
  }
  return out;
}
