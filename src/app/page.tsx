import { CursorGlow } from "@/components/motion/CursorGlow";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Beginning } from "@/components/scenes/Beginning";
import { Finale } from "@/components/scenes/Finale";
import { Future } from "@/components/scenes/Future";
import { Gallery } from "@/components/scenes/Gallery";
import { Letter } from "@/components/scenes/Letter";
import { LittleThings } from "@/components/scenes/LittleThings";
import { Mountains } from "@/components/scenes/Mountains";
import { Opening } from "@/components/scenes/Opening";
import { PolaroidTable } from "@/components/scenes/PolaroidTable";
import { Stranger } from "@/components/scenes/Stranger";
import { Sunflowers } from "@/components/scenes/Sunflowers";
import { Timeline } from "@/components/scenes/Timeline";
import { Wish } from "@/components/scenes/Wish";
import { TitleCard } from "@/components/scenes/TitleCard";
import { Controls } from "@/components/ui/Controls";
import { content } from "@/content/anniversary";
import { resolvePhotos } from "@/lib/photos.server";

const chapters = [
  { id: "top", label: "Two years. One forever." },
  { id: "met", label: "Once, a stranger" },
  { id: "mountains", label: "You sent me mountains" },
  { id: "beginning", label: "Our beginning" },
  { id: "timeline", label: "Two years of us" },
  { id: "table", label: "A table full of us" },
  { id: "gallery", label: "Moments we kept" },
  { id: "little-things", label: "The little things" },
  { id: "letter", label: "A letter from me" },
  { id: "bouquet", label: "Flowers for you" },
  { id: "future", label: "Our future" },
  { id: "wish", label: "Make a wish" },
  { id: "finale", label: "One last thing" },
];

export default function Home() {
  const photos = resolvePhotos();
  const c = content;

  return (
    <MotionProvider>
      <CursorGlow />
      <Opening
        kicker={c.opening.kicker}
        line={c.opening.line}
        button={c.opening.button}
        anniversaryGreeting={c.opening.anniversaryGreeting}
        weddingDate={c.weddingDate}
        timeZone={c.timeZone}
        her={c.her}
        him={c.him}
      />

      <main id="story">
        <div id="top">
          <TitleCard
            heading={c.title.heading}
            subtitle={c.title.subtitle}
            photo={photos[c.title.photo]}
            photoMobile={photos[c.title.photoMobile]}
            alt={c.title.alt}
            weddingDate={c.weddingDate}
            anniversaryDate={c.anniversaryDate}
            timeZone={c.timeZone}
          />
        </div>
        <Stranger
          story={c.stranger}
          her={c.her}
          stepPhotos={c.stranger.steps.map((s) => (s.photo ? photos[s.photo] : null))}
        />
        <Mountains story={c.mountains} photos={photos} />
        <Beginning {...c.beginning} photos={photos} />
        <Timeline {...c.timeline} photos={photos} />
        <PolaroidTable {...c.polaroids} photos={photos} />
        <Gallery
          headline={c.gallery.headline}
          intro={c.gallery.intro}
          photos={c.gallery.photos.map((id) => photos[id])}
        />
        <LittleThings {...c.littleThings} photos={photos} />
        <Letter letter={c.letter} photo={c.letter.photo ? photos[c.letter.photo] : undefined} />
        <Sunflowers bouquet={c.bouquet} her={c.her} />
        <Future
          headline={c.future.headline}
          intro={c.future.intro}
          dreams={c.future.dreams}
          countdown={c.future.countdown}
          photo={photos[c.future.photo]}
          photoMobile={photos[c.future.photoMobile]}
        />
        <Wish copy={c.wish} />
        <Finale finale={c.finale} photo={c.finale.photo ? photos[c.finale.photo] : undefined} />

        <footer className="bg-charcoal-950 text-ivory-100/35 px-5 pt-6 pb-24 text-center text-xs tracking-[0.2em] uppercase">
          {c.footer}
        </footer>

        <Controls musicSrc={c.music.src} musicTitle={c.music.title} chapters={chapters} />
      </main>
    </MotionProvider>
  );
}
