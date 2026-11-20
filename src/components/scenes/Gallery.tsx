"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";
import type { ResolvedPhoto } from "@/types/content";

// The lightbox code is only fetched the first time a photo is opened.
const Lightbox = dynamic(() => import("@/components/ui/Lightbox"), { ssr: false });

interface GalleryProps {
  headline: string;
  intro: string;
  photos: ResolvedPhoto[];
}

/**
 * An art-directed mosaic: portraits run tall, landscapes run wide, and the grid
 * packs densely so there are no holes. Every tile is a real button.
 */
export function Gallery({ headline, intro, photos }: GalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const [opened, setOpened] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);

  const openAt = (i: number, el: HTMLButtonElement) => {
    opener.current = el;
    setOpened(true);
    setIndex(i);
  };

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className="bg-wine-950 text-ivory-50 relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-gold-300">The gallery</p>
            <h2 id="gallery-title" className="display-lg mt-5">
              {headline}
            </h2>
          </div>
          <p className="text-ivory-100/60 text-sm">{intro}</p>
        </header>

        <ul className="mt-14 grid grid-flow-dense auto-rows-[30vw] grid-cols-2 gap-2 sm:auto-rows-[20vw] sm:grid-cols-3 sm:gap-3 lg:auto-rows-[15vw] lg:grid-cols-4 xl:auto-rows-[13.5rem]">
          {photos.map((photo, i) => (
            <li
              key={photo.id}
              className={cn("row-span-2", photo.orientation === "landscape" && "col-span-2")}
            >
              <button
                type="button"
                onClick={(e) => openAt(i, e.currentTarget)}
                className="group bg-wine-900 relative block h-full w-full overflow-hidden"
                aria-label={`Open photo: ${photo.caption ?? photo.alt}`}
              >
                <Photo
                  photo={photo}
                  fill
                  decorative
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  imgClassName="transition-transform duration-[1400ms] ease-(--ease-cinema) group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                />
                <span
                  aria-hidden
                  className="from-wine-950/70 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                {photo.caption && (
                  <span
                    aria-hidden
                    className="font-display text-ivory-50 pointer-events-none absolute right-3 bottom-3 left-3 translate-y-2 text-left text-lg italic opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    {photo.caption}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {opened && (
        <Lightbox
          photos={photos}
          index={index}
          onIndexChange={setIndex}
          onClose={() => {
            setIndex(null);
            opener.current?.focus();
          }}
        />
      )}
    </section>
  );
}
