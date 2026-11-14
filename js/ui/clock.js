/**
 * The round clock: a row of lamps, one per second, that go out in turn.
 */
import { ROUND_SECONDS, WARNING_SECONDS } from '../config.js';
import { el } from '../dom.js';
import { playTick, playTimeUp } from '../sound.js';

const CHECK_INTERVAL_MS = 100;

/**
 * Creates a clock. Add "element" to the page, then call start().
 * @returns {{ element: HTMLElement, start: () => Promise<void>, stop: () => void }}
 *   start() resolves when time runs out or stop() is called
 */
export function createClock() {
  const lamps = Array.from({ length: ROUND_SECONDS }, () => el('span', { class: 'lamp' }));
  const readout = el('span', { class: 'clock-readout', text: String(ROUND_SECONDS) });
  const element = el(
    'div',
    { class: 'clock', role: 'timer', 'aria-label': 'Seconds left' },
    el('div', { class: 'lamps' }, ...lamps),
    readout,
  );

  let intervalId = null;
  let finish = () => {};

  /** Updates the lamps and number to show the seconds left. */
  const render = (secondsLeft) => {
    readout.textContent = String(secondsLeft);
    lamps.forEach((lamp, index) => lamp.classList.toggle('out', index >= secondsLeft));
    element.classList.toggle('warning', secondsLeft <= WARNING_SECONDS);
  };

  const stop = () => {
    clearInterval(intervalId);
    intervalId = null;
    finish();
  };

  const start = () =>
    new Promise((resolve) => {
      finish = resolve;
      // Work from the real time rather than counting ticks, so the clock
      // stays right even if the browser slows the page down in a background tab.
      const endsAt = performance.now() + ROUND_SECONDS * 1000;
      let shown = ROUND_SECONDS;
      intervalId = setInterval(() => {
        const secondsLeft = Math.max(0, Math.ceil((endsAt - performance.now()) / 1000));
        if (secondsLeft === shown) return;
        shown = secondsLeft;
        render(secondsLeft);
        if (secondsLeft === 0) {
          playTimeUp();
          stop();
        } else if (secondsLeft <= WARNING_SECONDS) {
          playTick();
        }
      }, CHECK_INTERVAL_MS);
    });

  return { element, start, stop };
}
