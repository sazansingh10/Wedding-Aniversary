import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { ResolvedPhoto } from "@/types/content";

interface ArtDirectedPhotoProps {
  /** Shown on landscape screens (laptops, tablets held sideways). */
  wide: ResolvedPhoto;
  /** Shown on portrait screens (phones, tablets held upright). */
  tall: ResolvedPhoto;
  /** One description that holds for either crop. */
  alt: string;
  /** Above the fold: load eagerly with high priority. */
  priority?: boolean;
  imgClassName?: string;
}

/**
 * A full-bleed photograph that swaps to a different photo on portrait screens.
 * Uses <picture>, so the browser downloads exactly one of the two images.
 */
export function ArtDirectedPhoto({
  wide,
  tall,
  alt,
  priority,
  imgClassName,
}: ArtDirectedPhotoProps) {
  const fallback = tall.src ? tall : wide.src ? wide : null;
  if (!fallback?.src) return <div className="photo-placeholder absolute inset-0" />;

  const srcSetFor = (p: ResolvedPhoto) =>
    p.src ? getImageProps({ src: p.src, alt, fill: true, sizes: "100vw" }).props.srcSet : undefined;
  const base = getImageProps({ src: fallback.src, alt, fill: true, sizes: "100vw" }).props;
  const wideSet = srcSetFor(wide);
  const tallSet = srcSetFor(tall);

  const focus = {
    "--focus-wide": wide.focus ?? "50% 50%",
    "--focus-tall": tall.focus ?? "50% 50%",
  } as CSSProperties;

  return (
    <picture>
      {wideSet && <source media="(min-aspect-ratio: 1/1)" srcSet={wideSet} sizes="100vw" />}
      {tallSet && <source srcSet={tallSet} sizes="100vw" />}
      <img
        src={base.src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={cn(
          "film absolute inset-0 h-full w-full object-cover [object-position:var(--focus-tall)] [@media(min-aspect-ratio:1/1)]:[object-position:var(--focus-wide)]",
          imgClassName,
        )}
        style={focus}
      />
    </picture>
  );
}
