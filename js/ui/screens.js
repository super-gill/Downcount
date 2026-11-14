/**
 * The screens outside the rounds: the menu and the end-of-game summary.
 */
import { MODES, ROUND_SECONDS, VERSION } from '../config.js';
import { el, show } from '../dom.js';
import { getBestScore, isSoundOn, setSoundOn } from '../storage.js';

/** A menu button for a ranked mode, with its round count and best score. */
function modeButton(modeId, onPlay) {
  const mode = MODES[modeId];
  const best = getBestScore(modeId);
  return el(
    'button',
    { class: 'mode-button', onclick: () => onPlay(modeId) },
    el('span', { class: 'mode-name', text: mode.name }),
    el('span', { class: 'mode-detail', text: `${mode.rounds.length} rounds` }),
    el('span', { class: 'mode-detail', text: best === null ? 'Not played yet' : `Best score ${best}` }),
  );
}

/**
 * Shows the menu.
 * @param {HTMLElement} stage
 * @param {(modeId: string) => void} onPlay called with the chosen mode
 */
export function showMenu(stage, onPlay) {
  const soundToggle = el('input', {
    type: 'checkbox',
    onchange: () => setSoundOn(soundToggle.checked),
  });
  soundToggle.checked = isSoundOn();

  show(
    stage,
    el('p', { class: 'intro', text: `Make the longest word, hit the target number, crack the anagram. Every round gives you ${ROUND_SECONDS} seconds.` }),
    el('div', { class: 'mode-grid' }, modeButton('quick', onPlay), modeButton('full', onPlay)),
    el('h2', { text: 'Practise one round' }),
    el(
      'div',
      { class: 'actions' },
      el('button', { class: 'button', text: 'Letters', onclick: () => onPlay('letters') }),
      el('button', { class: 'button', text: 'Numbers', onclick: () => onPlay('numbers') }),
      el('button', { class: 'button', text: 'Conundrum', onclick: () => onPlay('conundrum') }),
    ),
    el('label', { class: 'sound-toggle' }, soundToggle, ' Clock sounds'),
    el('p', { class: 'version', text: `Version ${VERSION}` }),
  );
}

/**
 * Shows the end-of-game summary.
 * @param {HTMLElement} stage
 * @param {object} options
 * @param {string} options.modeName
 * @param {{ label: string, answer: string, score: number, max: number }[]} options.results
 * @param {boolean} options.isNewBest
 * @param {() => void} options.onPlayAgain
 * @param {() => void} options.onMenu
 */
export function showSummary(stage, { modeName, results, isNewBest, onPlayAgain, onMenu }) {
  const total = results.reduce((sum, result) => sum + result.score, 0);
  const max = results.reduce((sum, result) => sum + result.max, 0);
  const playAgain = el('button', { class: 'button primary', text: 'Play again', onclick: onPlayAgain });

  show(
    stage,
    el('header', { class: 'round-header' }, el('h2', { text: `${modeName} finished` })),
    el('p', { class: 'final-score' }, el('strong', { text: String(total) }), ` of a possible ${max} points`),
    isNewBest ? el('p', { class: 'new-best', text: 'That is your new best score.' }) : null,
    el(
      'table',
      { class: 'summary' },
      el('thead', {}, el('tr', {},
        el('th', { scope: 'col', text: 'Round' }),
        el('th', { scope: 'col', text: 'Your answer' }),
        el('th', { scope: 'col', class: 'number', text: 'Points' }),
        el('th', { scope: 'col', class: 'number', text: 'Possible' }),
      )),
      el('tbody', {}, ...results.map((result, index) => el('tr', {},
        el('td', { text: `${index + 1}. ${result.label}` }),
        el('td', { text: result.answer }),
        el('td', { class: 'number', text: String(result.score) }),
        el('td', { class: 'number', text: String(result.max) }),
      ))),
    ),
    el('div', { class: 'actions' }, playAgain, el('button', { class: 'button', text: 'Back to menu', onclick: onMenu })),
  );
  playAgain.focus();
}
