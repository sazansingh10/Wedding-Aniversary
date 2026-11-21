/**
 * "Nuga's Lullaby": an original music-box tune, composed and played live with
 * the Web Audio API. Nothing is downloaded and nothing is copyrighted.
 *
 * F major, 72 BPM, I – vi – IV – V. A music-box melody (bright, quickly
 * decaying bell partials) over a soft broken-chord accompaniment and a warm
 * pad, all through a gentle synthetic reverb. Loops seamlessly.
 * Loaded on demand (dynamic import) the first time the music toggle is pressed.
 */
export interface AmbientHandle {
  stop: () => Promise<void>;
  /** A short closing chime, used by the finale. */
  chime: () => void;
}

const BPM = 72;
const BEAT = 60 / BPM;

const NOTE: Record<string, number> = {};
// Note frequencies C1..C7
(() => {
  const names = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  for (let midi = 24; midi <= 96; midi++) {
    NOTE[`${names[midi % 12]}${Math.floor(midi / 12) - 1}`] = 440 * Math.pow(2, (midi - 69) / 12);
  }
})();

/** Chords per bar (bass root, then chord tones for the broken-chord figure). */
const CHORDS: string[][] = [
  ["F2", "C3", "F3", "A3"], // F
  ["D2", "A2", "D3", "F3"], // Dm
  ["Bb1", "F2", "Bb2", "D3"], // Bb
  ["C2", "G2", "C3", "E3"], // C
];

/** Melody: [note, beats]. Two 4-bar phrases = 8 bars, 32 beats. */
const MELODY: [string | null, number][] = [
  // phrase one: a question
  ["C5", 1],
  ["A4", 1],
  ["F5", 2],
  ["E5", 1],
  ["D5", 1],
  ["C5", 1],
  ["A4", 1],
  ["D5", 2],
  ["C5", 1],
  ["Bb4", 1],
  ["C5", 3],
  [null, 1],
  // phrase two: the answer, reaching higher, coming home
  ["A4", 1],
  ["C5", 1],
  ["F5", 1],
  ["G5", 1],
  ["A5", 2],
  ["G5", 1],
  ["F5", 1],
  ["F5", 1],
  ["D5", 1],
  ["C5", 1],
  ["E5", 1],
  ["F5", 3],
  [null, 1],
];

const BARS = 8;
const LOOP = BARS * 4 * BEAT;

function makeReverb(ctx: AudioContext, seconds = 3.2) {
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * seconds);
  const buf = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
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
  const dry = ctx.createGain();
  dry.gain.value = 0.75;
  const wet = ctx.createGain();
  wet.gain.value = 0.42;
  const reverb = makeReverb(ctx);
  const tone = ctx.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 5200;
  master.connect(tone);
  tone.connect(dry).connect(ctx.destination);
  tone.connect(reverb).connect(wet).connect(ctx.destination);

  const sources: AudioScheduledSourceNode[] = [];
  const track = (n: AudioScheduledSourceNode) => {
    sources.push(n);
    n.onended = () => {
      const i = sources.indexOf(n);
      if (i >= 0) sources.splice(i, 1);
    };
  };

  /** Music-box bell: bright partials, fast attack, long gentle decay. */
  const bell = (freq: number, t: number, vel = 0.22) => {
    const partials: [number, number][] = [
      [1, 1],
      [2, 0.38],
      [3, 0.12],
      [4.2, 0.06],
    ];
    for (const [mult, amp] of partials) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = freq * mult;
      const g = ctx.createGain();
      const decay = 2.4 / mult;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vel * amp, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + decay + 0.05);
      track(o);
    }
  };

  /** Soft, piano-ish pluck for the broken chords. */
  const pluck = (freq: number, t: number, vel = 0.07) => {
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = freq;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(2400, t);
    f.frequency.exponentialRampToValueAtTime(500, t + 1.2);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
    o.connect(f).connect(g).connect(master);
    o.start(t);
    o.stop(t + 1.9);
    track(o);
  };

  /** Warm pad under each bar. */
  const pad = (notes: string[], t: number, dur: number) => {
    for (const n of notes.slice(1)) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = NOTE[n] * 2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.018, t + dur * 0.4);
      g.gain.linearRampToValueAtTime(0, t + dur + 0.6);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + dur + 0.7);
      track(o);
    }
  };

  const scheduleLoop = (t0: number) => {
    // accompaniment: broken chord in eighths, bass on the downbeat
    for (let bar = 0; bar < BARS; bar++) {
      const chord = CHORDS[bar % 4];
      const tb = t0 + bar * 4 * BEAT;
      pad(chord, tb, 4 * BEAT);
      const pattern = [0, 2, 3, 1, 2, 3, 1, 2];
      pattern.forEach((idx, k) => {
        const n = chord[idx];
        pluck(NOTE[n] * (idx === 0 ? 1 : 2), tb + k * (BEAT / 2), idx === 0 ? 0.09 : 0.05);
      });
    }
    // melody
    let t = t0;
    for (const [n, beats] of MELODY) {
      if (n) bell(NOTE[n], t + (Math.random() - 0.5) * 0.012);
      t += beats * BEAT;
    }
  };

  // Look-ahead scheduler: always keep the next loop queued.
  let next = ctx.currentTime + 0.15;
  scheduleLoop(next);
  next += LOOP;
  const timer = window.setInterval(() => {
    if (ctx.currentTime > next - 1.5) {
      scheduleLoop(next);
      next += LOOP;
    }
  }, 250);

  const now = ctx.currentTime;
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(0.9, now + 2.5);

  return {
    chime: () => {
      const t = ctx.currentTime + 0.05;
      ["F5", "A5", "C6", "F6"].forEach((n, i) => bell(NOTE[n], t + i * 0.18, 0.2));
    },
    stop: async () => {
      window.clearInterval(timer);
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 1.2);
      await new Promise((r) => setTimeout(r, 1300));
      sources.slice().forEach((s) => {
        try {
          s.stop();
        } catch {
          /* already stopped */
        }
      });
      await ctx.close();
    },
  };
}
