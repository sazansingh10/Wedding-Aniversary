"use client";

import { m, type Variants } from "motion/react";
import { useRef, useState } from "react";
import { duration, ease } from "@/lib/motion";
import type { Bouquet } from "@/types/content";
import { FLOWERS } from "./sunflowerLayout";

const KNOT = { x: 200, y: 372 };
const PETALS = 18;

/** One sunflower petal, pointing up from the origin. */
const petal = (len: number, w: number) =>
  `M0,0 C${w},${-len * 0.3} ${w * 0.9},${-len * 0.8} 0,${-len} C${-w * 0.9},${-len * 0.8} ${-w},${-len * 0.3} 0,0Z`;

const stemVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (d: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: ease.cinema, delay: d - 0.45 },
  }),
};

const headVariants: Variants = {
  hidden: { scale: 0.2, opacity: 0, rotate: -40 },
  shown: (d: number) => ({
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 90, damping: 14, delay: d },
  }),
};

const fade: Variants = {
  hidden: { opacity: 0, y: 12 },
  shown: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.cinema, delay: d },
  }),
};

interface Falling {
  id: number;
  x: number;
  y: number;
  dx: number;
  rot: number;
}

/**
 * A bouquet of sunflowers, drawn in SVG. Stems draw themselves in, heads
 * bloom with a spring, then sway gently forever (CSS, so it costs nothing and
 * stops for reduced motion). Tapping the bouquet shakes loose a few petals.
 */
export function Sunflowers({ bouquet, her }: { bouquet: Bouquet; her: string }) {
  const [falling, setFalling] = useState<Falling[]>([]);
  const [tapped, setTapped] = useState(false);
  const nextId = useRef(0);

  const shake = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTapped(true);
    // The surprise: petals burst out of the bouquet and form a giant heart.
    const r = e.currentTarget.getBoundingClientRect();
    const ox = r.left + r.width / 2;
    const oy = r.top + r.height * 0.3;
    void import("@/lib/heartBurst").then((mod) => mod.burstHeart(ox, oy));
    const batch: Falling[] = Array.from({ length: 9 }, () => {
      const f = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
      return {
        id: nextId.current++,
        x: f.x + (Math.random() - 0.5) * f.r * 2,
        y: f.y + (Math.random() - 0.5) * f.r,
        dx: (Math.random() - 0.5) * 140,
        rot: (Math.random() - 0.5) * 540,
      };
    });
    setFalling((prev) => [...prev, ...batch]);
    window.setTimeout(
      () => setFalling((prev) => prev.filter((p) => !batch.some((b) => b.id === p.id))),
      3200,
    );
  };

  return (
    <section
      id="bouquet"
      aria-labelledby="bouquet-title"
      className="bg-wine-950 text-ivory-50 relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      {/* warm lamplight pooling where the bouquet sits */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 55% at 68% 50%, rgba(242,182,50,0.16), transparent 70%), radial-gradient(60% 60% at 0% 100%, rgba(122,39,64,0.45), transparent 70%)",
        }}
      />

      <m.div
        className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:px-12"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.35 }}
      >
        <div className="lg:col-span-5">
          <m.p variants={fade} className="eyebrow text-gold-300">
            {bouquet.eyebrow}
          </m.p>
          <m.h2
            variants={fade}
            custom={0.15}
            id="bouquet-title"
            className="display-lg mt-6 text-balance"
          >
            {bouquet.headline}
          </m.h2>
          <m.p
            variants={fade}
            custom={0.3}
            className="text-ivory-100/75 mt-6 max-w-md text-lg leading-relaxed text-pretty"
          >
            {bouquet.text}
          </m.p>
          <m.p
            variants={fade}
            custom={1.8}
            className="font-hand text-gold-300 mt-10 min-h-[3.5rem] text-3xl sm:text-4xl"
            aria-live="polite"
          >
            {tapped ? bouquet.afterTap : ""}
          </m.p>
        </div>

        <div className="lg:col-span-7">
          <button
            type="button"
            onClick={shake}
            className="group relative mx-auto block w-full max-w-[30rem] cursor-pointer rounded-3xl focus-visible:outline-offset-8"
            aria-label={`${bouquet.alt} ${bouquet.hint}`}
          >
            <m.svg
              viewBox="0 0 400 520"
              className="w-full overflow-visible"
              aria-hidden
              whileTap={{ rotate: [0, -2, 2, -1, 0], transition: { duration: 0.6 } }}
              style={{ transformOrigin: "50% 75%" }}
            >
              <defs>
                <linearGradient id="sf-petal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffd45a" />
                  <stop offset="100%" stopColor="#f2a51c" />
                </linearGradient>
                <linearGradient id="sf-petal-back" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e9a325" />
                  <stop offset="100%" stopColor="#c97814" />
                </linearGradient>
                <radialGradient id="sf-disk" cx="45%" cy="40%" r="65%">
                  <stop offset="0%" stopColor="#6b3f1a" />
                  <stop offset="60%" stopColor="#3d220f" />
                  <stop offset="100%" stopColor="#24130a" />
                </radialGradient>
                <linearGradient id="sf-paper" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e8d2a8" />
                  <stop offset="100%" stopColor="#c7a36e" />
                </linearGradient>
                <linearGradient id="sf-paper-back" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d9bd8a" />
                  <stop offset="100%" stopColor="#b48d58" />
                </linearGradient>
                <linearGradient id="sf-leaf" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#5f8a3a" />
                  <stop offset="100%" stopColor="#2f5a26" />
                </linearGradient>
              </defs>

              {/* back sheet of paper */}
              <m.path
                variants={fade}
                d="M96 250 L304 250 L236 470 L164 470 Z"
                fill="url(#sf-paper-back)"
              />

              {/* stems */}
              {FLOWERS.map((f, i) => (
                <m.path
                  key={`stem-${i}`}
                  custom={f.delay}
                  variants={stemVariants}
                  d={`M${f.x} ${f.y} Q ${(f.x + KNOT.x) / 2 + (f.x < 200 ? -10 : 10)} ${(f.y + KNOT.y) / 2} ${KNOT.x + (f.x - 200) * 0.06} ${KNOT.y}`}
                  stroke="#3f6b2c"
                  strokeWidth={4}
                  strokeLinecap="round"
                  fill="none"
                />
              ))}

              {/* leaves */}
              {[
                { x: 150, y: 270, r: -35 },
                { x: 252, y: 262, r: 35 },
                { x: 118, y: 236, r: -60 },
                { x: 286, y: 232, r: 60 },
              ].map((l, i) => (
                // Position lives on the plain <g>; Motion animates only the inner path.
                <g key={`leaf-${i}`} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}>
                  <m.path
                    variants={fade}
                    custom={1 + i * 0.1}
                    d="M0 0 C 14 -10, 34 -10, 48 0 C 34 10, 14 10, 0 0 Z"
                    fill="url(#sf-leaf)"
                  />
                </g>
              ))}

              {/* flower heads: outer <g> sways (CSS), inner <m.g> blooms (spring) */}
              {FLOWERS.map((f, i) => (
                <g
                  key={`head-${i}`}
                  className="sunflower-sway"
                  style={{
                    transformOrigin: `${f.x}px ${f.y + f.r * 3}px`,
                    animationDelay: `${-i * 0.7}s`,
                    animationDuration: `${5 + (i % 3)}s`,
                  }}
                >
                  <m.g custom={f.delay} variants={headVariants}>
                    <g transform={`translate(${f.x} ${f.y})`}>
                      {/* back ring */}
                      {Array.from({ length: PETALS }, (_, k) => (
                        <path
                          key={`b${k}`}
                          d={petal(f.r * 1.55, f.r * 0.3)}
                          fill="url(#sf-petal-back)"
                          transform={`rotate(${(360 / PETALS) * k + 10})`}
                        />
                      ))}
                      {/* front ring */}
                      {Array.from({ length: PETALS }, (_, k) => (
                        <path
                          key={`f${k}`}
                          d={petal(f.r * 1.4, f.r * 0.28)}
                          fill="url(#sf-petal)"
                          transform={`rotate(${(360 / PETALS) * k})`}
                        />
                      ))}
                      {/* seed disk */}
                      <circle r={f.r * 0.62} fill="url(#sf-disk)" />
                      {[0.5, 0.36, 0.22].map((k) => (
                        <circle
                          key={k}
                          r={f.r * k}
                          fill="none"
                          stroke="#1c0e06"
                          strokeOpacity={0.55}
                          strokeWidth={1.4}
                          strokeDasharray="1.2 2.6"
                        />
                      ))}
                      <circle
                        r={f.r * 0.62}
                        fill="none"
                        stroke="#8a5523"
                        strokeOpacity={0.5}
                        strokeWidth={1}
                      />
                    </g>
                  </m.g>
                </g>
              ))}

              {/* front sheet of paper, folded */}
              <m.g variants={fade} custom={0.2}>
                <path d="M70 262 L200 300 L236 476 L164 476 Z" fill="url(#sf-paper)" />
                <path d="M330 262 L200 300 L236 476 Z" fill="#d6b57f" />
                <path d="M200 300 L218 476" stroke="#9c7745" strokeOpacity={0.35} strokeWidth={1} />
              </m.g>

              {/* ribbon */}
              <m.g variants={fade} custom={1.4}>
                <path
                  d="M196 384 C 176 368, 150 372, 156 392 C 162 408, 186 398, 196 388 Z"
                  fill="#7a2740"
                />
                <path
                  d="M204 384 C 224 368, 250 372, 244 392 C 238 408, 214 398, 204 388 Z"
                  fill="#7a2740"
                />
                <path d="M194 390 L180 440 L190 436 L196 444 Z" fill="#5a1a2f" />
                <path d="M206 390 L220 440 L210 436 L204 444 Z" fill="#5a1a2f" />
                <circle cx={200} cy={387} r={8} fill="#8d3049" />
              </m.g>

              {/* gift tag on a string */}
              <m.g variants={fade} custom={1.7}>
                <path
                  d="M206 392 C 240 410, 262 400, 276 414"
                  stroke="#e3cfa4"
                  strokeWidth={1}
                  fill="none"
                />
                <g transform="translate(270 410) rotate(-8)">
                  <path d="M0 8 L14 0 L120 0 L120 52 L14 52 L0 44 Z" fill="#fbf7f0" />
                  <circle cx={12} cy={26} r={3} fill="#c7a36e" />
                  <text
                    x={68}
                    y={25}
                    textAnchor="middle"
                    fill="#5a1a2f"
                    style={{ fontFamily: "var(--font-hand)", fontSize: 19 }}
                  >
                    {bouquet.tag}
                  </text>
                  <text
                    x={68}
                    y={42}
                    textAnchor="middle"
                    fill="#7a2740"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 6.5,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    {bouquet.tagNote}
                  </text>
                </g>
              </m.g>

              {/* petals shaken loose */}
              {falling.map((p) => (
                <m.path
                  key={p.id}
                  d={petal(16, 4.5)}
                  fill="url(#sf-petal)"
                  initial={{ x: p.x, y: p.y, rotate: 0, opacity: 1 }}
                  animate={{ x: p.x + p.dx, y: p.y + 380, rotate: p.rot, opacity: 0 }}
                  transition={{ duration: 3, ease: [0.25, 0.1, 0.25, 1] }}
                />
              ))}
            </m.svg>
            <span className="text-ivory-100/50 group-hover:text-gold-300 mt-4 block text-center text-xs tracking-[0.22em] uppercase transition-colors">
              {bouquet.hint}
            </span>
          </button>
          <span className="sr-only">For {her}.</span>
        </div>
      </m.div>
    </section>
  );
}
