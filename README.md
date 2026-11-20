# Two Years. One Forever.

A private, cinematic anniversary letter for Neela, 21 November 2026.
Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 and Motion. It has no database and no backend, and it is prerendered as one static page.

---

## 1. Make it yours (5 minutes)

### Photos

Copy the photos into `public/photos/` using these names. Any slot whose file is missing shows a soft wine-coloured placeholder instead of a broken image, so the site never breaks.

| File                       | The photo                              | Where it appears                                   |
| -------------------------- | -------------------------------------- | -------------------------------------------------- |
| `01-ring.jpg`              | Ring going onto her hennaed hand       | Timeline: wedding                                  |
| `02-wedding-day.jpg`       | Wedding day, garlands, family clapping | Beginning: wedding                                 |
| `03-holding-hands.jpg`     | Hands: green sleeve and red lace       | Beginning: how we met                              |
| `04-portrait-together.jpg` | Portrait, her hand on his chest        | **Title card on phones**; Letter (tucked photo)    |
| `05-neela-walking.jpg`     | Neela walking down the cobbled path    | Little things: kindness                            |
| `06-sajan.jpg`             | Sajan alone, looking back              | Gallery                                            |
| `07-embrace.jpg`           | Embrace, gazing at each other          | Timeline: 2nd anniversary                          |
| `08-pavilion.jpg`          | Wooden pavilion balcony                | Little things: home                                |
| `09-twirl.jpg`             | Twirl under the tree                   | **Final reveal**                                   |
| `10-her-glance.jpg`        | Neela glancing over her shoulder       | Beginning: the moment I knew; Little things: smile |
| `11-by-the-water.jpg`      | Forehead kiss by the pond              | **Title card on laptops**                          |
| `12-temple-sky.jpg`        | Under the temple roof, pagoda behind   | Little things: voice                               |
| `13-stairs-portrait.jpg`   | Helping her up the steps (tall)        | Future (on phones)                                 |
| `14-stairs.jpg`            | Helping her up the steps (wide)        | Future (larger screens); Timeline: first year      |
| `15-the-bell.jpg`          | By the big bronze bell                 | Gallery                                            |
| `16-golden-door.jpg`       | In the golden doorway                  | Little things: strength                            |
| `17-selfie.jpg`            | Selfie in front of the pagoda          | Beginning: favourite memories                      |
| `18-cartoon-us.jpg`        | Phone showing you both as cartoons     | Timeline: favourite moments                        |

Photos 19–30 (first date, bike ride, laughing, carved window, bride-to-be, wedding garlands, the mountain silhouette, and her two mountain photos) were picked from a larger batch. The originals, including the unused ones, are in `photo-originals/`. That folder sits outside `public/`, so it's never served, and it's gitignored. The copies in `public/photos/` were re-encoded with location and device metadata stripped.

Every photo is also in the gallery. To change captions, alt text or which part of a photo stays in frame when it's cropped (`focus`), edit `src/content/photos.ts`.

Original JPGs are fine. `next/image` resizes them and serves AVIF/WebP at the right size for each screen.

### Words

**Every word is in `src/content/anniversary.ts`.**

- **Reunion countdown:** set `future.countdown.target` to a wall-clock time, for example `"2027-01-15T18:00"`. While it is `null`, the countdown stays hidden. It hides itself again once the moment has passed.
- **Music:** put an MP3 at `public/audio/our-song.mp3` and set `music.src` to `"/audio/our-song.mp3"`. Until then, the toggle plays a soft generated ambient chord. Music never autoplays.
- The time zone is `Asia/Kathmandu`. It drives the "married for" counter and the countdown.

## 2. Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # typecheck + lint + tests + production build
```

Use Node 22 LTS or newer. The project also runs on Node 21, but some dev tools only support even-numbered releases. `.npmrc` sets `legacy-peer-deps` to avoid a peer-resolution crash in older npm versions.

After adding or renaming photos, restart `npm run dev` or rebuild. The server checks which files exist when it renders the page.

## 3. The experience

1. **Opening.** A sealed envelope with an N & S wax seal on a candle-lit stage. "Open our story" lifts the flap and slides the letter out, then the stage dissolves. This scene is pure CSS, so first paint never waits for JavaScript.
2. **Title card.** A full-bleed photograph with a slow Ken Burns move, the title, and a live counter of how long you've been married.
3. **Prologue: once, a stranger.** You met on Snapchat in October 2022 (worked out by counting 1,504 days back from 20 November 2026, which lands on 8 October 2022). Your first date was 10 June 2023. A phone shows a notification, "New message from: a stranger". Then each name is struck through in gold and rewritten: _someone I couldn't stop talking to → my favourite person → my fiancée → my wife_. The photo inside the message changes at every step (her mountain snaps, the first-date hands, laughing, bride-to-be, the wedding garlands), and the phone's year changes as the story moves forward, and a replay button appears at the end. Edit the steps in `stranger.steps`.
4. **A confession: "You sent me mountains."** When you were friends on Snapchat, she sent you mountain photos, and you (a mountain guy) saved them and posted them without asking. Her two panoramas hang as framed prints with museum labels (_"Photograph by Neela · Saved and posted without permission by Sajan"_), followed by _"Sorry. Not sorry."_ in handwriting. The payoff is your sunset silhouette in front of the mountains: _"I kept your mountains. Then I got to keep you."_
5. **Our beginning.** Six editorial chapters with roman numerals, alternating photo and text.
6. **Two years of us.** A gold thread that draws itself as you scroll, then a mosaic gallery with a keyboard and swipe lightbox.
7. **A table full of us.** Eight loose polaroids on a lamp-lit table. With a mouse she can drag them anywhere (the one she picks up comes to the top) and click one to turn it over and read the handwritten note on the back. On phones they sit in a scattered grid so scrolling still works, and a tap turns them over. Edit `polaroids.items`.
8. **The little things.** A typographic list. On large screens, each line crossfades a framed photograph with its message.
9. **The letter.** Paragraphs surface one at a time like ink settling, with a "Read it all now" button and a handwritten signature.
10. **Flowers for you.** _"I can't hand you flowers today. So I made you some that will never wilt."_ Twelve hand-drawn SVG sunflowers (three rows: five, four and three): stems draw in, heads bloom with a spring and sway forever, all wrapped in kraft paper with a wine ribbon and a "For Nuga" tag. **The surprise:** tapping the bouquet bursts about 160 petals across the whole screen. They gather into a giant glowing heart, beat once, then rain down (canvas, loaded on first tap, skipped for reduced motion).
11. **Our future.** A wide photograph of you climbing the steps together, six dreams, and the optional countdown.
12. **Finale.** The page drains to night: three lines, then "I would still choose you." The button reveals stars, a warm glow, the twirl photograph in an arched frame, and the message.

Floating controls (bottom right): a music toggle and a chapter menu.
On a laptop, a soft candle-coloured light follows the mouse, and the final button leans gently toward the cursor. Both are off on touch screens and with reduced motion.

Motion tokens (durations, easing, springs) live in `src/lib/motion.ts`, with the durations mirrored in `globals.css`, so every animation shares one rhythm.

## 4. Deploying privately

**Recommended: Vercel, free tier.** Import the repository, then turn on **Deployment Protection → Password Protection** or **Vercel Authentication**. Share the link only with Neela. Netlify (password protection on paid plans) and Cloudflare Pages + Cloudflare Access (free, email one-time code) also work well.

What this project already does for privacy:

- `noindex, nofollow, noarchive, noimageindex` in both a meta tag and the `X-Robots-Tag` header, and a `robots.txt` that disallows everything. There is no sitemap on purpose.
- The link-preview image and description contain no photos, names or details.
- No analytics, cookies, third-party scripts, fonts from other hosts, forms or data collection.
- `Referrer-Policy: no-referrer`, so the URL doesn't leak to other sites.

**Limitations, honestly:** an unlisted URL is not private. Anyone who has the link can open it and forward it, and robots rules are requests that well-behaved crawlers follow, not locks. Real privacy needs the host's password or access protection above. **If your GitHub repository is public, the photos you commit are public too.** Keep the repository private, or add `public/photos/` to `.gitignore` and deploy with `vercel deploy` from your machine.

## 5. Security review

| Area             | Status                                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Security headers | CSP, HSTS, `nosniff`, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, a restrictive Permissions-Policy, COOP/CORP. `X-Powered-By` removed.                                                                                                                                                                                                                         |
| CSP              | Same-origin only: no remote scripts, images, fonts or connections; `object-src 'none'`; `form-action 'none'`. Scripts need `'unsafe-inline'` because the page is prerendered and static, which leaves no per-request nonce. That is the standard trade-off for a CDN-cached page with no user input. Moving to nonces would mean rendering the page on every request. |
| XSS              | No `dangerouslySetInnerHTML`, no user input, no URL-driven content. All text comes from typed constants and is escaped by React.                                                                                                                                                                                                                                      |
| Secrets          | None exist. `.env*` is gitignored. Only `NEXT_PUBLIC_SITE_URL` (not secret) is read.                                                                                                                                                                                                                                                                                  |
| Endpoints        | None. Rate limiting, auth, cookies and input validation don't apply; add them only if a backend is introduced.                                                                                                                                                                                                                                                        |
| Dependencies     | `npm audit`: **0 vulnerabilities**. Runtime dependencies are `next`, `react`, `react-dom`, `motion` and `server-only`.                                                                                                                                                                                                                                                |

## 6. Performance notes

- The page is prerendered once and served as static HTML, so it can sit on any CDN.
- First paint is the CSS-only envelope. The title photo is the single preloaded image; every other image lazy-loads at a size matched to the screen, as AVIF or WebP.
- The animation library loads asynchronously (`LazyMotion`). The lightbox, particle canvas and ambient-audio code load only when first needed.
- Fonts are self-hosted with `next/font` and `display: swap`. The handwriting font is not preloaded because it's only used below the fold.
- Particle canvases cap device pixel ratio, pause when off-screen or when the tab is hidden, and render one still frame for reduced motion.
- Static assets under `/_next/static` are immutable and cached for a year. Photos are cached for a day, so you can swap one under the same name.
- Measured locally on the production build: DOMContentLoaded at about 200 ms, and about 230 KB of gzipped JavaScript referenced by the page (including lazy chunks). **Lighthouse has not been run.** Run it on the deployed URL with the real photos in place (Chrome DevTools → Lighthouse → Mobile).

## 7. What's needed now vs. at scale

**Now:** one static page on a CDN with host-level password protection. That is all of it.
**Only if it grows** (guestbook, uploads, many visitors): a small API route with input validation and rate limiting, object storage for media, and a managed Postgres database with pooling and indexes once there are queries to index. Servers would stay stateless, so the host scales them horizontally. Kubernetes, microservices, Redis, auth and load balancers aren't needed here. Static CDN hosting already absorbs any realistic traffic.

## 8. QA report

These checks were actually run on 20 November 2026:

- [x] `tsc --noEmit`: passes
- [x] ESLint (`--max-warnings=0`): passes
- [x] Prettier: all files formatted
- [x] Vitest: **18/18 pass** (time-zone maths including Kathmandu's +5:45 and DST, durations, content integrity: every photo referenced exists, unique ids, dates in order, key dates correct)
- [x] `next build`: passes, all routes static
- [x] Browser (dev and prod): no console errors, no CSP violations, no hydration warnings
- [x] No horizontal overflow at 320, 375, 430, 768, 1024 and 1440 px (one 4 px overflow at 375 px was found and fixed)
- [x] Opening: locks scroll and makes the story inert while shown; opening returns to the top and moves focus to the title
- [x] Lightbox: opens, focus moves inside, arrow keys and wrap-around work, close returns focus to the tile, page scroll restored
- [x] Chapter menu: opens, Escape closes it and returns focus; 8 links, all anchors resolve
- [x] Music toggle: plays and pauses (generated ambient), `aria-pressed` updates
- [x] Letter: progressive reveal runs; text is in the DOM throughout
- [x] Final reveal: stars, message, signature; focus moves to the message
- [x] Stranger prologue: plays through all five steps, the strike-through draws, the year advances, replay works, and the full sequence is in a screen-reader list
- [x] Polaroid table: dragging moves a print with momentum and brings it to the front; releasing a drag doesn't flip it; clicking flips (`aria-pressed`); phones get the tap-to-flip grid and no overflow at 375 px
- [x] Cursor glow follows the mouse; magnetic button present
- [x] Bouquet renders all seven heads, leaves and tag; tapping starts the petal-heart overlay and shows the follow-up line. The full heart animation was only partly observable because the preview pane throttles animation frames, so watch it once on a real device.
- [x] Stranger phone cycles through all six step photos in order
- [x] No broken images

**Not verified yet:**

- [x] **Real photos:** all 18 are in `public/photos/`, and the crops were checked in the browser at phone and desktop sizes. The hero shows the portrait photo on portrait screens and the pond photo on landscape screens, and only one is downloaded.
- [ ] **Reduced motion** was reviewed in code (CSS media query, `MotionConfig reducedMotion="user"`, instant opening, instant letter, still particles) but not toggled in a real OS setting. To test it, turn on Windows Settings → Accessibility → Visual effects → Animation effects **off**, then reload.
- [ ] **Real devices** (iOS Safari, Android Chrome). Tested in Chromium device emulation only.
- [ ] **Screen reader** pass (NVDA or VoiceOver). The structure is semantic and labelled, but no screen reader was run.
- [ ] Lighthouse and Core Web Vitals on the deployed URL.
- [ ] A real MP3, if you add one (only the generated ambient chord was tested).

## Project structure

```
src/
  app/            layout, page, global styles, robots, icon, OG image
  components/
    scenes/       Opening, TitleCard, Beginning, Timeline, Gallery, LittleThings, Letter, Future, Finale
    ui/           Photo, Lightbox, Controls (music + chapters), MarriedFor, Countdown, ArtDirectedPhoto
    motion/       MotionProvider (lazy), Reveal, ScrollLine, Particles
  content/        anniversary.ts (all words), photos.ts (photo library)
  config/         site.ts
  hooks/          useNow, useInViewOnce, useSessionFlag
  lib/            time (pure, tested), ambient audio, photo resolution, cn
  types/          content model
tests/            vitest unit tests
```
