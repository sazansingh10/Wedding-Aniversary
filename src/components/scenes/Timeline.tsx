import { Reveal } from "@/components/motion/Reveal";
import { ScrollLine } from "@/components/motion/ScrollLine";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";
import { formatLongDate } from "@/lib/time";
import type { PhotoId, ResolvedPhoto, TimelineEvent } from "@/types/content";

interface TimelineProps {
  headline: string;
  intro: string;
  events: TimelineEvent[];
  photos: Record<PhotoId, ResolvedPhoto>;
}

/**
 * Scene 3: a vertical timeline. The gold thread draws itself as you scroll.
 * Mobile: thread on the left. Desktop: thread in the centre, entries alternate.
 */
export function Timeline({ headline, intro, events, photos }: TimelineProps) {
  return (
    <section
      id="timeline"
      aria-labelledby="timeline-title"
      className="on-ivory bg-ivory-100 relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <Reveal as="header" className="text-center">
          <p className="eyebrow text-wine-600">Chapter two</p>
          <h2 id="timeline-title" className="display-lg text-wine-800 mt-6">
            {headline}
          </h2>
          <p className="text-charcoal-700 mx-auto mt-6 max-w-md text-lg text-pretty">{intro}</p>
        </Reveal>

        <div className="relative mt-20 sm:mt-28">
          <ScrollLine className="absolute top-0 bottom-0 left-[11px] w-px md:left-1/2 md:-translate-x-1/2" />

          <ol className="space-y-16 md:space-y-28">
            {events.map((ev, i) => {
              const photo = ev.photo ? photos[ev.photo] : undefined;
              const right = i % 2 === 1;
              const when = ev.date ? formatLongDate(ev.date) : (ev.label ?? "");
              return (
                <li key={ev.id} className="relative grid md:grid-cols-2 md:gap-20">
                  {/* node on the thread */}
                  <span
                    aria-hidden
                    className={cn(
                      "bg-ivory-100 absolute top-2 left-[11px] z-10 grid size-[23px] -translate-x-1/2 place-items-center rounded-full border md:left-1/2",
                      ev.highlight ? "border-wine-600" : "border-gold-500",
                    )}
                  >
                    <span
                      className={cn(
                        "size-[9px] rounded-full",
                        ev.highlight ? "bg-wine-600" : "bg-gold-500",
                      )}
                    />
                  </span>

                  <Reveal
                    className={cn(
                      "pl-12 md:pl-0",
                      right ? "md:col-start-2 md:pl-4" : "md:col-start-1 md:pr-4 md:text-right",
                    )}
                  >
                    {ev.date ? (
                      <time dateTime={ev.date} className="eyebrow text-wine-600">
                        {when}
                      </time>
                    ) : (
                      <span className="eyebrow text-wine-600">{when}</span>
                    )}
                    <h3 className="display-md text-wine-800 mt-3">{ev.title}</h3>
                    <p
                      className={cn(
                        "text-charcoal-700 mt-4 max-w-md text-[1.0625rem] leading-[1.8] text-pretty",
                        !right && "md:ml-auto",
                      )}
                    >
                      {ev.story}
                    </p>
                  </Reveal>

                  {photo && (
                    <Reveal
                      as="figure"
                      delay={0.12}
                      className={cn(
                        "mt-8 pl-12 md:mt-0 md:pl-0",
                        right ? "md:col-start-1 md:row-start-1 md:pr-4" : "md:col-start-2 md:pl-4",
                      )}
                    >
                      <Photo
                        photo={photo}
                        ratio="4 / 3"
                        sizes="(min-width: 768px) 40vw, 85vw"
                        className={cn(
                          "shadow-[0_24px_50px_-28px_rgba(58,17,31,0.6)]",
                          right ? "md:rotate-[-1.2deg]" : "md:rotate-[1.2deg]",
                        )}
                      />
                    </Reveal>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
