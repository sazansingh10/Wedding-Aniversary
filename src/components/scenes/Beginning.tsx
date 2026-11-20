import { Reveal } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";
import type { PhotoId, ResolvedPhoto, StoryChapter } from "@/types/content";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

interface BeginningProps {
  headline: string;
  intro: string;
  chapters: StoryChapter[];
  photos: Record<PhotoId, ResolvedPhoto>;
}

/** Scene 2: an editorial telling of how it started. Text and photos alternate sides. */
export function Beginning({ headline, intro, chapters, photos }: BeginningProps) {
  let photoIndex = 0;
  return (
    <section
      id="beginning"
      aria-labelledby="beginning-title"
      className="on-ivory bg-ivory-50 text-charcoal-900 relative overflow-x-clip py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal as="header" className="max-w-4xl">
          <p className="eyebrow text-wine-600">Chapter one · Our beginning</p>
          <h2 id="beginning-title" className="display-lg text-wine-800 mt-6 text-balance">
            {headline}
          </h2>
          <p className="text-charcoal-700 mt-8 max-w-xl text-lg leading-relaxed text-pretty">
            {intro}
          </p>
        </Reveal>

        <ol className="mt-20 space-y-24 sm:mt-28 sm:space-y-32 lg:space-y-40">
          {chapters.map((ch, i) => {
            const photo = ch.photo ? photos[ch.photo] : undefined;
            const flip = photo ? photoIndex++ % 2 === 1 : false;
            return (
              <li key={ch.id}>
                {photo ? (
                  <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
                    <Reveal
                      as="figure"
                      className={cn(
                        "relative md:col-span-6 md:row-start-1",
                        flip ? "md:col-start-7" : "md:col-start-1",
                        photo.orientation === "portrait" ? "mx-auto w-[82%] md:w-[78%]" : "",
                      )}
                    >
                      <div
                        aria-hidden
                        className={cn(
                          "border-gold-400/50 absolute -inset-2 -z-0 border sm:-inset-4",
                          flip
                            ? "translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3"
                            : "-translate-x-2 translate-y-2 sm:-translate-x-3 sm:translate-y-3",
                        )}
                      />
                      <Photo
                        photo={photo}
                        sizes="(min-width: 768px) 45vw, 90vw"
                        className="relative shadow-[0_30px_60px_-30px_rgba(58,17,31,0.55)]"
                      />
                      {ch.inset && (
                        // A second, smaller print tucked just below the first.
                        <div className="bg-ivory-50 relative z-10 -mt-10 ml-auto w-[46%] rotate-[3deg] p-2 pb-3 shadow-[0_20px_40px_-18px_rgba(58,17,31,0.6)] sm:-mt-16 sm:p-2.5">
                          <Photo
                            photo={photos[ch.inset]}
                            ratio="4 / 3"
                            sizes="(min-width: 768px) 22vw, 42vw"
                          />
                        </div>
                      )}
                      {photo.caption && (
                        <figcaption className="font-display text-charcoal-500 mt-4 text-base italic">
                          {photo.caption}
                        </figcaption>
                      )}
                    </Reveal>
                    <Reveal
                      delay={0.15}
                      className={cn(
                        "md:col-span-5 md:row-start-1",
                        flip ? "md:col-start-1" : "md:col-start-8",
                      )}
                    >
                      <ChapterText chapter={ch} index={i} />
                    </Reveal>
                  </div>
                ) : (
                  <Reveal className="mx-auto max-w-3xl text-center">
                    <ChapterText chapter={ch} index={i} centered />
                  </Reveal>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function ChapterText({
  chapter,
  index,
  centered,
}: {
  chapter: StoryChapter;
  index: number;
  centered?: boolean;
}) {
  return (
    <div className={cn(centered && "flex flex-col items-center")}>
      <div className={cn("flex items-baseline gap-4", centered && "justify-center")}>
        <span
          aria-hidden
          className="font-display text-gold-500 text-5xl leading-none font-light italic"
        >
          {ROMAN[index]}
        </span>
        <span className="eyebrow text-wine-600">{chapter.eyebrow}</span>
      </div>
      <h3 className="display-md text-wine-800 mt-5 text-balance">{chapter.title}</h3>
      {chapter.body.map((p, i) => (
        <p
          key={i}
          className={cn(
            "text-charcoal-700 mt-5 text-[1.0625rem] leading-[1.8] text-pretty",
            centered ? "max-w-2xl" : "max-w-lg",
          )}
        >
          {p}
        </p>
      ))}
      {centered && <div aria-hidden className="rule-gold mt-10 w-40" />}
    </div>
  );
}
