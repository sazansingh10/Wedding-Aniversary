import Image from "next/image";
import { cn } from "@/lib/cn";
import type { ResolvedPhoto } from "@/types/content";

interface PhotoProps {
  photo: ResolvedPhoto;
  /** Responsive `sizes` hint. Getting this right keeps mobile downloads small. */
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Only for the single above-the-fold hero image. */
  preload?: boolean;
  /** Override the frame ratio (defaults to the photo's own orientation). */
  ratio?: string;
  /** Fill the parent instead of using an intrinsic ratio. */
  fill?: boolean;
  /** Decorative usage (e.g. a background repeat of a photo already described). */
  decorative?: boolean;
}

/**
 * A photograph in a frame. Always reserves space (no layout shift), lazy loads
 * by default, serves AVIF/WebP via next/image, and degrades to a soft
 * placeholder when the file has not been added yet.
 */
export function Photo({
  photo,
  sizes,
  className,
  imgClassName,
  preload,
  ratio,
  fill,
  decorative,
}: PhotoProps) {
  const aspect = ratio ?? (photo.orientation === "portrait" ? "2 / 3" : "3 / 2");
  return (
    <div
      className={cn("relative overflow-hidden", fill ? "h-full w-full" : "w-full", className)}
      style={fill ? undefined : { aspectRatio: aspect }}
    >
      {photo.src ? (
        <Image
          src={photo.src}
          alt={decorative ? "" : photo.alt}
          fill
          sizes={sizes}
          preload={preload}
          className={cn("film object-cover", imgClassName)}
          style={{ objectPosition: photo.focus ?? "50% 50%" }}
        />
      ) : (
        <div
          className="photo-placeholder absolute inset-0 flex items-end justify-center p-4"
          role={decorative ? undefined : "img"}
          aria-label={decorative ? undefined : photo.alt}
        >
          {process.env.NODE_ENV !== "production" && (
            <span className="eyebrow text-gold-300/80 text-[0.6rem]">
              add public/photos/{photo.file}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
