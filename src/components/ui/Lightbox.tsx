"use client";

import Image from "next/image";
import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import type { ResolvedPhoto } from "@/types/content";

interface LightboxProps {
  photos: ResolvedPhoto[];
  index: number | null;
  onIndexChange: Dispatch<SetStateAction<number | null>>;
  /** Called after the dialog closes; the caller restores focus to the opener. */
  onClose: () => void;
}

/**
 * Accessible lightbox on the native <dialog> element: the browser handles focus
 * trapping, Escape and making the rest of the page inert. Arrow keys and swipe
 * move between photos; focus returns to the opening tile on close.
 */
export default function Lightbox({ photos, index, onIndexChange, onClose }: LightboxProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;
  const count = photos.length;

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) {
      dlg.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dlg.open) {
      dlg.close();
    }
  }, [open]);

  const handleClose = () => {
    document.documentElement.style.overflow = "";
    onClose();
  };

  if (index === null) return <dialog ref={ref} className="lightbox" onClose={handleClose} />;

  const photo = photos[index];
  const go = (delta: number) =>
    onIndexChange((i) => (i === null ? i : (i + delta + count) % count));

  return (
    <dialog
      ref={ref}
      className="lightbox text-ivory-50 fixed inset-0 m-0 h-dvh w-screen bg-transparent p-0"
      aria-label="Photo viewer"
      onClose={handleClose}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        touchX.current = null;
        if (start == null || end == null) return;
        if (Math.abs(end - start) > 50) go(end < start ? 1 : -1);
      }}
    >
      <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center px-3 py-16 sm:px-16">
        <figure className="pointer-events-auto relative flex h-full w-full max-w-6xl flex-col items-center justify-center">
          <div className="relative h-full w-full">
            {photo.src ? (
              <Image
                key={photo.id}
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            ) : (
              <div
                role="img"
                aria-label={photo.alt}
                className="photo-placeholder absolute inset-0"
              />
            )}
          </div>
          <figcaption className="mt-4 text-center">
            {photo.caption && <span className="font-display text-xl italic">{photo.caption}</span>}
            <span className="text-ivory-100/60 ml-3 text-xs tracking-[0.2em]">
              {index + 1} / {count}
            </span>
          </figcaption>
        </figure>
      </div>

      <button
        type="button"
        onClick={() => ref.current?.close()}
        className="text-ivory-50 hover:bg-ivory-50/10 absolute top-3 right-3 grid size-12 place-items-center rounded-full text-2xl"
        aria-label="Close photo viewer"
        autoFocus
      >
        ×
      </button>
      <button
        type="button"
        onClick={() => go(-1)}
        className="text-ivory-50 hover:bg-ivory-50/10 absolute top-1/2 left-1 grid size-12 -translate-y-1/2 place-items-center rounded-full text-2xl sm:left-4"
        aria-label="Previous photo"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        className="text-ivory-50 hover:bg-ivory-50/10 absolute top-1/2 right-1 grid size-12 -translate-y-1/2 place-items-center rounded-full text-2xl sm:right-4"
        aria-label="Next photo"
      >
        ›
      </button>
      <p className="sr-only" aria-live="polite">
        Photo {index + 1} of {count}. {photo.alt}
      </p>
    </dialog>
  );
}
