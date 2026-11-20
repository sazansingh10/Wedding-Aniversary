import { Reveal } from "@/components/motion/Reveal";
import { Countdown } from "@/components/ui/Countdown";
import { ArtDirectedPhoto } from "@/components/ui/ArtDirectedPhoto";
import type { Countdown as CountdownConfig, Dream, ResolvedPhoto } from "@/types/content";

interface FutureProps {
  headline: string;
  intro: string;
  dreams: Dream[];
  countdown: CountdownConfig;
  photo: ResolvedPhoto;
  photoMobile: ResolvedPhoto;
}

/** Scene 6: hopeful and warm. A wide photograph of the two of them climbing, then the dreams. */
export function Future({ headline, intro, dreams, countdown, photo, photoMobile }: FutureProps) {
  return (
    <section id="future" aria-labelledby="future-title" className="on-ivory bg-ivory-50 relative">
      {/* Art-directed: tall photo on portrait screens, wide on landscape. */}
      <div className="relative isolate h-[88svh] min-h-[32rem] overflow-hidden">
        <ArtDirectedPhoto
          wide={photo}
          tall={photoMobile}
          alt="Sajan reaching back to help Neela up ancient stone steps, their hands joined."
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(22,5,9,0.45), rgba(22,5,9,0.05) 35%, rgba(251,247,240,0) 70%, rgba(251,247,240,1) 100%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 mx-auto max-w-7xl px-5 pt-20 sm:px-8 sm:pt-28 lg:px-12">
          <Reveal>
            <p className="eyebrow text-gold-300">Chapter five · Our future</p>
            <h2
              id="future-title"
              className="display-lg text-ivory-50 mt-6 max-w-3xl text-balance [text-shadow:0_2px_30px_rgba(22,5,9,0.45)]"
            >
              {headline}
            </h2>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12 lg:pb-40">
        <Reveal>
          <p className="font-display text-wine-800 max-w-xl text-2xl leading-snug text-pretty italic sm:text-3xl">
            {intro}
          </p>
        </Reveal>

        <ol className="mt-16 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {dreams.map((d, i) => (
            <Reveal
              as="li"
              key={d.id}
              delay={(i % 3) * 0.08}
              className="border-wine-700/20 border-t pt-6"
            >
              <span aria-hidden className="font-display text-gold-500 text-4xl font-light italic">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-wine-800 mt-3 text-[1.75rem] leading-tight">
                {d.title}
              </h3>
              <p className="text-charcoal-700 mt-3 max-w-sm text-[1.0625rem] leading-[1.8] text-pretty">
                {d.text}
              </p>
            </Reveal>
          ))}
        </ol>

        <Countdown {...countdown} />
      </div>
    </section>
  );
}
