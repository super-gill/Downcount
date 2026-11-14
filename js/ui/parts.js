/**
 * Page pieces shared by more than one round.
 */
import { el } from '../dom.js';

/** A single letter or number tile. Pass '' for an empty slot. */
export function tile(content, extraClass = '') {
  const empty = content === '';
  return el('span', {
    class: `tile ${empty ? 'tile-empty' : ''} ${extraClass}`.trim(),
    text: String(content),
  });
}

/** A row of tiles, padded with empty slots up to "size". */
export function tileRow(contents, size = contents.length) {
  const padded = [...contents, ...Array(Math.max(0, size - contents.length)).fill('')];
  return el('div', { class: 'tile-row' }, ...padded.map((content) => tile(content)));
}

/** The heading and one-line instruction at the top of each round. */
export function roundHeader(title, instruction) {
  return el(
    'header',
    { class: 'round-header' },
    el('h2', { text: title }),
    el('p', { class: 'instruction', text: instruction }),
  );
}

/**
 * The result panel shown when a round ends.
 * @param {object} options
 * @param {string} options.verdict one line saying how the player did
 * @param {number} options.score points won
 * @param {number} options.max the most points that were available
 * @param {(Node|null)[]} options.details extra content, such as the best words
 * @param {() => void} options.onNext called when the player moves on
 */
export function resultPanel({ verdict, score, max, details, onNext }) {
  const nextButton = el('button', { class: 'button primary', text: 'Continue', onclick: onNext });
  // Focus the button so Enter moves on, but not before the panel is on the page.
  requestAnimationFrame(() => nextButton.focus());
  return el(
    'section',
    { class: 'result', 'aria-live': 'polite' },
    el('p', { class: 'verdict', text: verdict }),
    el('p', { class: 'points', text: `${score} of a possible ${max} points` }),
    ...details,
    nextButton,
  );
}
