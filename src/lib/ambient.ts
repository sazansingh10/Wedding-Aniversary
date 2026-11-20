/**
 * A soft, slowly breathing ambient chord made with the Web Audio API. Used
 * when no audio file is configured, so the music toggle always works and
 * nothing extra has to be downloaded. Loaded on demand (dynamic import).
 */
export interface AmbientHandle {
  stop: () => Promise<void>;
}

export async function startAmbient(): Promise<AmbientHandle> {
  const AudioCtx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) throw new Error("Web Audio unavailable");
  const ctx = new AudioCtx();
  await ctx.resume();

  const master = ctx.createGain();
  master.gain.value = 0;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.4;
  master.connect(filter).connect(ctx.destination);

  // D major add9, voiced low and open.
  const notes = [146.83, 220.0, 293.66, 369.99, 329.63];
  const voices = notes.map((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = i % 2 ? "sine" : "triangle";
    osc.frequency.value = freq;
    osc.detune.value = (i - 2) * 3;
    const g = ctx.createGain();
    g.gain.value = 0.05;
    // Each voice swells at its own slow rate, so the chord breathes.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.04 + i * 0.013;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.035;
    lfo.connect(lfoGain).connect(g.gain);
    osc.connect(g).connect(master);
    osc.start();
    lfo.start();
    return [osc, lfo];
  });

  const now = ctx.currentTime;
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(0.55, now + 4);

  return {
    stop: async () => {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 1.2);
      await new Promise((r) => setTimeout(r, 1300));
      voices.flat().forEach((n) => n.stop());
      await ctx.close();
    },
  };
}
