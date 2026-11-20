import { Drift } from "@/components/motion/Drift";
import { Reveal } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import type { MountainsStory, PhotoId, ResolvedPhoto } from "@/types/content";

interface MountainsProps {
  story: MountainsStory;
  photos: Record<PhotoId, ResolvedPhoto>;
}

/**
 * A confession, told like a small exhibition. Her two mountain photos hang as
 * framed prints with museum labels; then the reveal: years later, the two of
 * them standing in front of mountains together.
 */
export function Mountains({ story, photos }: MountainsProps) {
  const [first, second] = story.prints.map((p) => ({ ...p, photo: photos[p.photo] }));
  const payoff = photos[story.payoff.photo];

  return (
    <section
      id="mountains"
      aria-labelledby="mountains-title"
      className="from-charcoal-950 text-ivory-50 relative overflow-hidden bg-gradient-to-b via-[#1d1a22] to-[#2a2230] py-24 sm:py-32 lg:py-40"
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal as="header" className="max-w-3xl">
          <p className="eyebrow text-gold-300">{story.eyebrow}</p>
          <h2 id="mountains-title" className="display-lg mt-6 text-balance">
            {story.headline}
          </h2>
          {story.body.map((p, i) => (
            <p
              key={i}
              className="text-ivory-100/75 mt-6 max-w-xl text-lg leading-relaxed text-pretty"
            >
              {p}
            </p>
          ))}
        </Reveal>

        {/* The exhibition: two framed prints with museum placards */}
        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-8">
          {[first, second].map((print, i) => (
            <Reveal
              key={print.photo.id}
              as="figure"
              delay={i * 0.15}
              className={i === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-24"}
            >
              <Drift distance={i === 0 ? 36 : -36}>
                <div className="border-ivory-50/15 border bg-[#f4ede0] p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] sm:p-5">
                  <Photo photo={print.photo} ratio="16 / 9" sizes="(min-width: 768px) 55vw, 92vw" />
                </div>
              </Drift>
              <figcaption className="border-gold-300/40 mt-5 max-w-sm border-l pl-4">
                <p className="font-display text-ivory-50 text-lg italic">{print.title}</p>
                {print.credit && (
                  <p className="font-hand text-gold-300 mt-1 text-2xl leading-tight">
                    {print.credit}
                  </p>
                )}
              </figcaption>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 text-center sm:mt-28">
          <p className="font-hand text-gold-300 text-[clamp(2.6rem,6vw,4.5rem)] leading-none">
            {story.apology}
          </p>
        </Reveal>

        {/* The payoff */}
        <div className="mt-20 grid items-center gap-12 sm:mt-28 md:grid-cols-12">
          <Reveal as="figure" className="mx-auto w-[78%] md:col-span-5 md:w-full">
            <div className="border-gold-300/30 overflow-hidden rounded-t-full border p-1.5">
              <div className="overflow-hidden rounded-t-full">
                <Photo photo={payoff} ratio="3 / 4" sizes="(min-width: 768px) 38vw, 78vw" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="md:col-span-6 md:col-start-7">
            <p className="eyebrow text-gold-300">{story.payoff.eyebrow}</p>
            <p className="display-md mt-5 text-balance">{story.payoff.line}</p>
            <p className="text-ivory-100/75 mt-6 max-w-md text-lg leading-relaxed text-pretty">
              {story.payoff.text}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
