/**
 * Content model for the anniversary experience.
 * Everything a person would want to edit lives in `src/content/anniversary.ts`
 * and conforms to these types.
 */

export type PhotoId =
  | "ring"
  | "wedding-day"
  | "holding-hands"
  | "portrait-together"
  | "neela-walking"
  | "sajan"
  | "embrace"
  | "pavilion"
  | "twirl"
  | "her-glance"
  | "by-the-water"
  | "temple-sky"
  | "stairs-portrait"
  | "stairs"
  | "the-bell"
  | "golden-door"
  | "selfie"
  | "cartoon-us"
  | "bike-ride"
  | "first-date-hands"
  | "first-date-cafe"
  | "laughing"
  | "playful-walk"
  | "wedding-garlands"
  | "mountain-silhouette"
  | "cozy-selfie"
  | "carved-window"
  | "bride-to-be"
  | "her-mountains-1"
  | "her-mountains-2";

export type Orientation = "landscape" | "portrait";

export interface Photo {
  id: PhotoId;
  /** File name inside /public/photos. */
  file: string;
  orientation: Orientation;
  /** Describes the image for screen readers. Required. */
  alt: string;
  /** Short caption shown in the gallery and lightbox. */
  caption?: string;
  /** CSS object-position, used to keep faces in frame when cropped. */
  focus?: string;
}

/** A photo after the server has checked the file exists. */
export interface ResolvedPhoto extends Photo {
  src: string | null;
}

export interface StoryChapter {
  id: string;
  eyebrow: string;
  title: string;
  body: string[];
  photo?: PhotoId;
  /** A second, smaller print tucked below the main photo. */
  inset?: PhotoId;
}

export interface TimelineEvent {
  id: string;
  /** ISO date (YYYY-MM-DD). Leave null when unknown; `label` is shown instead. */
  date: string | null;
  label?: string;
  title: string;
  story: string;
  photo?: PhotoId;
  highlight?: boolean;
}

export interface LittleThing {
  id: string;
  title: string;
  message: string;
  photo?: PhotoId;
}

export interface Letter {
  title: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
  signature: string;
  photo?: PhotoId;
}

export interface Dream {
  id: string;
  title: string;
  text: string;
}

export interface Countdown {
  /** Wall-clock time in `timeZone`, e.g. "2027-01-15T18:00". null hides the countdown. */
  target: string | null;
  timeZone: string;
  label: string;
}

export interface Finale {
  lines: string[];
  choose: string;
  buttonLabel: string;
  message: string[];
  signature: string;
  photo?: PhotoId;
}

export interface MusicConfig {
  /**
   * Path inside /public to an audio file (e.g. "/audio/our-song.mp3").
   * null uses a soft generated ambient tone instead, so the toggle always works.
   */
  src: string | null;
  title: string;
}

export interface StrangerStory {
  eyebrow: string;
  headline: string;
  intro: string;
  sender: string;
  /** Each step's photo is shown inside the message while that word is on screen. */
  steps: { label: string; note: string; photo?: PhotoId }[];
  outro: string;
  replay: string;
}

export interface MountainsStory {
  eyebrow: string;
  headline: string;
  body: string[];
  /** Her photos, hung like prints, each with a museum-style label. */
  prints: { photo: PhotoId; title: string; credit: string }[];
  apology: string;
  payoff: { photo: PhotoId; eyebrow: string; line: string; text: string };
}

export interface WishCopy {
  eyebrow: string;
  headline: string;
  text: string;
  label: string;
  placeholder: string;
  button: string;
  sending: string;
  sentHeadline: string;
  sentText: string;
  error: string;
}

export interface Bouquet {
  eyebrow: string;
  headline: string;
  text: string;
  hint: string;
  /** Appears after she taps the bouquet. */
  afterTap: string;
  /** Handwritten on the gift tag. */
  tag: string;
  tagNote: string;
  alt: string;
}

export interface Polaroid {
  photo: PhotoId;
  /** Short handwritten caption under the print (keep it to a few words). */
  label: string;
  /** Handwritten on the back. */
  note: string;
}

export interface AnniversaryContent {
  her: string;
  him: string;
  /** IANA zone used for "married for" maths and the countdown. */
  timeZone: string;
  weddingDate: string;
  anniversaryDate: string;
  opening: {
    kicker: string;
    line: string;
    button: string;
    /** Shown only on the anniversary itself. "{nth}" becomes 2nd, 3rd, ... */
    anniversaryGreeting: string;
  };
  title: {
    heading: string;
    subtitle: string;
    photo: PhotoId;
    photoMobile: PhotoId;
    alt: string;
  };
  stranger: StrangerStory;
  mountains: MountainsStory;
  polaroids: {
    eyebrow: string;
    headline: string;
    hintFine: string;
    hintCoarse: string;
    items: Polaroid[];
  };
  beginning: { headline: string; intro: string; chapters: StoryChapter[] };
  timeline: { headline: string; intro: string; events: TimelineEvent[] };
  gallery: { headline: string; intro: string; photos: PhotoId[] };
  littleThings: { headline: string; intro: string; items: LittleThing[] };
  letter: Letter;
  bouquet: Bouquet;
  wish: WishCopy;
  future: {
    headline: string;
    intro: string;
    dreams: Dream[];
    countdown: Countdown;
    photo: PhotoId;
    photoMobile: PhotoId;
  };
  finale: Finale;
  music: MusicConfig;
  footer: string;
}
