/**
 * Motion tokens: one shared rhythm for every animation on the site.
 * CSS mirrors the durations as --duration-* in globals.css.
 */
export const ease = {
  /** Slow-out, cinematic settle. The house easing. */
  cinema: [0.22, 1, 0.36, 1] as const,
};

export const duration = {
  quick: 0.2,
  base: 0.6,
  slow: 1.1,
  cinematic: 1.6,
} as const;

export const spring = {
  /** UI feedback: buttons, hovers. */
  snappy: { type: "spring", stiffness: 400, damping: 28 } as const,
  /** Objects with weight: polaroids, cards. */
  paper: { type: "spring", stiffness: 220, damping: 22, mass: 0.8 } as const,
  /** Things that follow the pointer. */
  follow: { stiffness: 140, damping: 22, mass: 0.6 } as const,
};
