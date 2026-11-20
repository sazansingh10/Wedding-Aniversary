/**
 * Where each of the twelve sunflowers sits in the bouquet (400×520 view box):
 * a back row of five, a middle row of four, a front row of three.
 *
 * Sizes are deliberately uneven, like a real hand-tied bouquet, but fixed
 * (not Math.random) so the bouquet looks identical on every visit and the
 * server and browser render the same thing. The smallest head is r = 19;
 * nothing goes below it.
 *
 * `delay` staggers the bloom so the bouquet opens from the front outward.
 */
export const MIN_RADIUS = 19;

export const FLOWERS = [
  // back row
  { x: 82, y: 114, r: 19, delay: 1.25 },
  { x: 136, y: 84, r: 24, delay: 1.1 },
  { x: 200, y: 70, r: 21, delay: 1.0 },
  { x: 262, y: 86, r: 27, delay: 1.15 },
  { x: 318, y: 116, r: 20, delay: 1.3 },
  // middle row
  { x: 106, y: 162, r: 28, delay: 0.85 },
  { x: 168, y: 138, r: 22, delay: 0.7 },
  { x: 232, y: 142, r: 31, delay: 0.75 },
  { x: 296, y: 164, r: 23, delay: 0.9 },
  // front row
  { x: 140, y: 214, r: 26, delay: 0.55 },
  { x: 202, y: 200, r: 34, delay: 0.45 },
  { x: 264, y: 216, r: 25, delay: 0.6 },
] as const;
