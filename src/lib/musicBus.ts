import type { AmbientHandle } from "@/lib/ambient";

/**
 * Tiny shared handle to the playing lullaby, so the finale can add a closing
 * chime without the music controls and the finale knowing about each other.
 */
let current: AmbientHandle | null = null;

export const musicBus = {
  set(handle: AmbientHandle | null) {
    current = handle;
  },
  /** Plays the closing chime only if the lullaby is currently on. */
  chime() {
    current?.chime();
  },
};
