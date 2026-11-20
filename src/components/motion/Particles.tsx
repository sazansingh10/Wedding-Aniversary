"use client";

import { useEffect, useRef } from "react";

interface ParticlesProps {
  /** "motes" drift upward like dust in candlelight; "stars" twinkle in place. */
  variant?: "motes" | "stars";
  density?: number;
  className?: string;
}

interface Dot {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  phase: number;
  speed: number;
}

/**
 * Lightweight canvas ambience. Capped device pixel ratio, pauses when off-screen
 * or when the tab is hidden, and renders a single still frame for reduced motion.
 */
export default function Particles({ variant = "motes", density = 1, className }: ParticlesProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let raf = 0;
    let running = false;
    let visible = true;

    const seed = () => {
      const area = (w * h) / 14000;
      const count = Math.round(Math.min(140, Math.max(18, area)) * density);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: variant === "stars" ? Math.random() * 1.1 + 0.3 : Math.random() * 1.8 + 0.4,
        vy: variant === "stars" ? 0 : -(Math.random() * 0.18 + 0.04),
        vx: variant === "stars" ? 0 : (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.004,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (!running) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const tw = 0.45 + 0.55 * Math.abs(Math.sin(d.phase));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle =
          variant === "stars"
            ? `rgba(251, 247, 240, ${0.25 + tw * 0.65})`
            : `rgba(227, 207, 164, ${0.12 + tw * 0.45})`;
        ctx.fill();
      }
    };

    const tick = () => {
      for (const d of dots) {
        d.phase += d.speed;
        d.y += d.vy;
        d.x += d.vx;
        if (d.y < -4) {
          d.y = h + 4;
          d.x = Math.random() * w;
        }
        if (d.x < -4) d.x = w + 4;
        if (d.x > w + 4) d.x = -4;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduce || running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [variant, density]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className ?? "absolute inset-0 h-full w-full"}
    />
  );
}
