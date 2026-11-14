/**
 * The letters round screen: pick nine letters, then make the longest word.
 */
import { RACK_SIZE, ROUND_SECONDS } from '../config.js';
import { el, show, wait } from '../dom.js';
import {
  allowedDraws, canMakeWord, createPiles, findBestWords, scoreWord,
} from '../logic/letters.js';
import { createClock } from './clock.js';
import { resultPanel, roundHeader, tileRow } from './parts.js';

const PAUSE_BEFORE_CLOCK_MS = 700;
const BEST_WORDS_SHOWN = 5;

/**
 * Runs one letters round.
 * @param {HTMLElement} stage where the round is drawn
 * @param {{ words: string[], wordSet: Set<string> }} dictionary
 * @returns {Promise<{ label: string, answer: string, score: number, max: number }>}
 */
export function playLettersRound(stage, dictionary) {
  return new Promise((resolve) => {
    const piles = createPiles(Math.random);
    const rack = [];

    /** Takes the top letter from a pile and moves on once the rack is full. */
    const draw = (pileName) => {
      if (!allowedDraws(rack)[pileName]) return;
      rack.push(piles[pileName].pop());
      if (rack.length === RACK_SIZE) {
        document.removeEventListener('keydown', onPickKey);
        showPlaying();
      } else {
        showPicking();
      }
    };

    /** Lets the player press V or C instead of clicking. */
    const onPickKey = (event) => {
      const key = event.key.toLowerCase();
      if (key === 'v') draw('vowel');
      if (key === 'c') draw('consonant');
    };
    document.addEventListener('keydown', onPickKey);

    const showPicking = () => {
      const allowed = allowedDraws(rack);
      show(
        stage,
        roundHeader('Letters', `Pick ${RACK_SIZE} letters. You need at least three vowels and four consonants.`),
        tileRow(rack, RACK_SIZE),
        el(
          'div',
          { class: 'actions' },
          el('button', { class: 'button', text: 'Vowel (V)', disabled: !allowed.vowel, onclick: () => draw('vowel') }),
          el('button', { class: 'button', text: 'Consonant (C)', disabled: !allowed.consonant, onclick: () => draw('consonant') }),
        ),
      );
    };

    const showPlaying = async () => {
      const clock = createClock();
      const hint = el('p', { class: 'hint', 'aria-live': 'polite' });
      const input = el('input', {
        class: 'answer-input',
        type: 'text',
        maxlength: RACK_SIZE,
        autocomplete: 'off',
        autocapitalize: 'off',
        spellcheck: 'false',
        'aria-label': 'Your word',
        disabled: true,
        oninput: () => {
          input.value = input.value.toLowerCase().replace(/[^a-z]/g, '');
          hint.textContent = canMakeWord(input.value, rack) ? '' : 'You do not have the letters for that.';
        },
      });
      const lockIn = el('button', { class: 'button primary', type: 'submit', text: 'Lock in word', disabled: true });
      const form = el(
        'form',
        { class: 'answer-form', onsubmit: (event) => { event.preventDefault(); clock.stop(); } },
        input,
        lockIn,
      );

      show(
        stage,
        roundHeader('Letters', `Make the longest word you can. Whatever is in the box after ${ROUND_SECONDS} seconds is your answer.`),
        clock.element,
        tileRow(rack),
        form,
        hint,
      );

      await wait(PAUSE_BEFORE_CLOCK_MS);
      input.disabled = false;
      lockIn.disabled = false;
      input.focus();
      await clock.start();
      showResult(input.value);
    };

    const showResult = (word) => {
      const best = findBestWords(rack, dictionary.words, BEST_WORDS_SHOWN);
      const max = best.length ? scoreWord(best[0]) : 0;

      let score = 0;
      let verdict;
      if (word === '') {
        verdict = 'No word entered.';
      } else if (!canMakeWord(word, rack)) {
        verdict = `${word.toUpperCase()} uses letters that are not on the rack.`;
      } else if (!dictionary.wordSet.has(word)) {
        verdict = `${word.toUpperCase()} is not in the dictionary.`;
      } else {
        score = scoreWord(word);
        verdict = `${word.toUpperCase()} is good for ${word.length} letters.`;
      }

      show(
        stage,
        roundHeader('Letters', 'Time is up.'),
        tileRow(rack),
        resultPanel({
          verdict,
          score,
          max,
          details: [
            el('p', { text: 'Longest words available:' }),
            el('ul', { class: 'word-list' }, ...best.map((bestWord) =>
              el('li', {}, el('span', { class: 'word', text: bestWord }), ` (${bestWord.length})`),
            )),
          ],
          onNext: () => resolve({ label: 'Letters', answer: word.toUpperCase() || 'No word', score, max }),
        }),
      );
    };

    showPicking();
  });
}
