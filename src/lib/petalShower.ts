/**
 * A gentle shower of sunflower petals falling from the top of the screen.
 * Used for the anniversary-day welcome. Temporary canvas overlay, removed
 * when the petals have fallen; skipped entirely for reduced motion.
 */
export function petalShower(durationMs = 6500): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
    zIndex: "65",
  });
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const count = Math.round(Math.min(140, Math.max(60, (w * h) / 9000)));
  const petals = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: -20 - Math.random() * h * 0.9,
    vy: 1.1 + Math.random() * 1.6,
    sway: 0.6 + Math.random() * 1.2,
    phase: Math.random() * Math.PI * 2,
    rot: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.06,
    len: 8 + Math.random() * 8,
    hue: 38 + Math.random() * 12,
  }));

  const start = performance.now();
  const frame = (now: number) => {
    const el = now - start;
    const fade = el > durationMs - 1200 ? Math.max(0, (durationMs - el) / 1200) : 1;
    ctx.clearRect(0, 0, w, h);
    for (const p of petals) {
      p.phase += 0.02;
      p.y += p.vy;
      p.x += Math.sin(p.phase) * p.sway;
      p.rot += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = fade;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.len * 0.32, p.len, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${p.hue} 95% ${58 + (p.hue - 38)}%)`;
      ctx.fill();
      ctx.restore();
    }
    if (el < durationMs) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}
