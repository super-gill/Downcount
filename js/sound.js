/**
 * Clock sounds, made with the browser's built-in tone generator so there
 * are no audio files to load.
 */
import { isSoundOn } from './storage.js';

let audioContext = null;

/** Plays one short tone. Fails silently where audio is not available. */
function beep(frequency, seconds) {
  if (!isSoundOn()) return;
  try {
    audioContext ??= new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + seconds);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + seconds);
  } catch {
    // No audio support: carry on without sound.
  }
}

/** The tick for each of the final seconds. */
export function playTick() {
  beep(880, 0.12);
}

/** The lower, longer tone when time runs out. */
export function playTimeUp() {
  beep(220, 0.7);
}
