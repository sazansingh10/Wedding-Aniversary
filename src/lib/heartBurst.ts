/**
 * The surprise. A storm of sunflower petals bursts out of the bouquet, flies
 * across the whole screen, gathers into one giant heart, beats once, and then
 * rains down and away.
 *
 * Plain canvas + requestAnimationFrame on a temporary full-screen overlay:
 * no React re-renders, about 160 sprites, removed from the DOM when it ends.
 * Loaded on demand (dynamic import) the first time the bouquet is tapped.
 */

interface Petal {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  delay: number;
  rot: number;
  spin: number;
  len: number;
  vx: number;
  vy: number;
  hue: number;
  cx: number;
  cy: number;
}

const COUNT = 160;
const FLY = 1500; // ms to reach the heart
const HOLD = 1700; // ms the heart holds and beats
const FALL = 2600; // ms of petal rain

const easeOutBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Point on the classic heart curve, t in [0, 2π). y grows downward. */
function heartPoint(t: number) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x: x / 17, y: y / 17 };
}

let running = false;

export function burstHeart(originX: number, originY: number): void {
  if (running) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  running = true;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: "70",
  } satisfies Partial<CSSStyleDeclaration>);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    running = false;
    return;
  }
  ctx.scale(dpr, dpr);

  const size = Math.min(w, h) * 0.36;
  const cx = w / 2;
  const cy = h / 2 - size * 0.05;

  const petals: Petal[] = Array.from({ length: COUNT }, (_, i) => {
    // two-thirds trace the outline, the rest fill it in
    const t = (i / COUNT) * Math.PI * 2 * 1.5;
    const p = heartPoint(t);
    const inner = i % 3 === 2 ? 0.35 + Math.random() * 0.55 : 1;
    return {
      sx: originX + (Math.random() - 0.5) * 60,
      sy: originY + (Math.random() - 0.5) * 60,
      tx: cx + p.x * size * inner + (Math.random() - 0.5) * 6,
      ty: cy + p.y * size * inner + (Math.random() - 0.5) * 6,
      delay: Math.random() * 450,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.25,
      len: 9 + Math.random() * 9,
      vx: (Math.random() - 0.5) * 2.4,
      vy: -Math.random() * 2.5,
      hue: 38 + Math.random() * 12,
      // a curved flight: each petal arcs through its own control point
      cx: (originX + cx) / 2 + (Math.random() - 0.5) * w * 0.9,
      cy: Math.min(originY, cy) - Math.random() * h * 0.45,
    };
  });

  const drawPetal = (x: number, y: number, rot: number, len: number, hue: number, a: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.ellipse(0, 0, len * 0.32, len, 0, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${hue} 95% ${58 + (hue - 38)}%)`;
    ctx.fill();
    ctx.restore();
  };

  const start = performance.now();
  const total = FLY + 450 + HOLD + FALL;

  const frame = (now: number) => {
    const el = now - start;
    ctx.clearRect(0, 0, w, h);

    // a soft gold bloom behind the heart while it holds
    const holdT = (el - FLY - 450) / HOLD;
    if (holdT > -0.2 && holdT < 1.2) {
      const a = Math.max(0, Math.min(1, 1 - Math.abs(holdT - 0.5) * 1.6)) * 0.35;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.6);
      g.addColorStop(0, `rgba(255, 214, 120, ${a})`);
      g.addColorStop(1, "rgba(255, 214, 120, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    // one heartbeat in the middle of the hold
    const beat =
      holdT > 0.25 && holdT < 0.65 ? 1 + 0.08 * Math.sin(((holdT - 0.25) / 0.4) * Math.PI * 2) : 1;

    for (const p of petals) {
      const t = el - p.delay;
      if (t < 0) continue;
      p.rot += p.spin;
      if (t < FLY) {
        // fly along a quadratic curve to its place in the heart
        const k = easeOutBack(Math.min(1, t / FLY));
        const kk = Math.min(1, k);
        const x = (1 - kk) * (1 - kk) * p.sx + 2 * (1 - kk) * kk * p.cx + kk * kk * p.tx;
        const y = (1 - kk) * (1 - kk) * p.sy + 2 * (1 - kk) * kk * p.cy + kk * kk * p.ty;
        drawPetal(x, y, p.rot, p.len, p.hue, Math.min(1, t / 200));
      } else if (el < FLY + 450 + HOLD) {
        const x = cx + (p.tx - cx) * beat;
        const y = cy + (p.ty - cy) * beat;
        drawPetal(x, y, p.rot, p.len, p.hue, 1);
      } else {
        // rain: gravity, a little drift, fade out
        p.vy += 0.16;
        p.vx *= 0.995;
        p.tx += p.vx + Math.sin(el / 300 + p.hue) * 0.6;
        p.ty += p.vy;
        const fadeT = (el - (FLY + 450 + HOLD)) / FALL;
        drawPetal(p.tx, p.ty, p.rot, p.len, p.hue, Math.max(0, 1 - fadeT * fadeT));
      }
    }

    if (el < total) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
      running = false;
    }
  };
  requestAnimationFrame(frame);
}
