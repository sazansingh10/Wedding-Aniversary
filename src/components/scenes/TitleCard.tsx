import { ArtDirectedPhoto } from "@/components/ui/ArtDirectedPhoto";
import { MarriedFor } from "@/components/ui/MarriedFor";
import { formatLongDate } from "@/lib/time";
import type { ResolvedPhoto } from "@/types/content";

interface TitleCardProps {
  heading: string;
  subtitle: string;
  photo: ResolvedPhoto;
  photoMobile: ResolvedPhoto;
  alt: string;
  weddingDate: string;
  anniversaryDate: string;
  timeZone: string;
}

/** The cinematic title card that greets her after the envelope opens. */
export function TitleCard({
  heading,
  subtitle,
  photo,
  photoMobile,
  alt,
  weddingDate,
  anniversaryDate,
  timeZone,
}: TitleCardProps) {
  const [first, ...rest] = heading.split(". ");
  return (
    <header className="bg-wine-950 text-ivory-50 relative isolate flex min-h-dvh flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* On landscape screens, enlarge from the left edge so the couple sits
            right of centre and the title has open water to sit on. */}
        <div className="absolute inset-0 [@media(min-aspect-ratio:1/1)]:origin-[0%_55%] [@media(min-aspect-ratio:1/1)]:scale-[1.28]">
          <ArtDirectedPhoto
            wide={photo}
            tall={photoMobile}
            alt={alt}
            priority
            imgClassName="animate-kenburns"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 hidden [@media(min-aspect-ratio:1/1)]:block"
          style={{
            background:
              "linear-gradient(to right, rgba(22,5,9,0.55) 0%, rgba(22,5,9,0.25) 40%, rgba(22,5,9,0) 60%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(22,5,9,0.5) 0%, rgba(22,5,9,0) 22%, rgba(22,5,9,0.25) 40%, rgba(22,5,9,0.72) 62%, rgba(22,5,9,0.96) 100%)",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pt-32 pb-14 sm:px-8 sm:pb-20 lg:px-12">
        <p className="rise eyebrow text-gold-300" style={{ animationDelay: "200ms" }}>
          {formatLongDate(weddingDate)} — {formatLongDate(anniversaryDate)}
        </p>
        <h2
          id="story-start"
          tabIndex={-1}
          className="rise display-xl mt-5 text-balance outline-none"
          style={{ animationDelay: "400ms" }}
        >
          <span className="block">{first}.</span>
          <span className="text-gold-300 block italic">{rest.join(". ")}</span>
        </h2>
        <div className="mt-8 grid gap-8 sm:mt-10 md:grid-cols-[1fr_auto] md:items-end">
          <p
            className="rise text-ivory-100/90 max-w-xl text-base leading-relaxed text-pretty sm:text-lg"
            style={{ animationDelay: "700ms" }}
          >
            {subtitle}
          </p>
          <div className="rise" style={{ animationDelay: "900ms" }}>
            <MarriedFor since={weddingDate} timeZone={timeZone} />
          </div>
        </div>
        <a
          href="#met"
          className="text-ivory-100/70 hover:text-gold-300 mt-12 inline-flex min-h-11 items-center gap-3 text-xs tracking-[0.3em] uppercase transition-colors"
        >
          <span aria-hidden className="block h-px w-10 bg-current" />
          Begin
        </a>
      </div>
    </header>
  );
}
