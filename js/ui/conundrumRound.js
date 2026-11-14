/**
 * The conundrum round screen: unscramble one nine-letter word.
 */
import { CONUNDRUM_POINTS, ROUND_SECONDS } from '../config.js';
import { el, show } from '../dom.js';
import { isSolution, scrambleWord } from '../logic/conundrum.js';
import { randomInt } from '../logic/random.js';
import { createClock } from './clock.js';
import { resultPanel, roundHeader, tileRow } from './parts.js';

/**
 * Runs one conundrum round.
 * @param {HTMLElement} stage where the round is drawn
 * @param {{ wordSet: Set<string>, conundrums: string[] }} dictionary
 * @returns {Promise<{ label: string, answer: string, score: number, max: number }>}
 */
export function playConundrumRound(stage, dictionary) {
  return new Promise((resolve) => {
    const { conundrums, wordSet } = dictionary;
    const answer = conundrums[randomInt(0, conundrums.length - 1, Math.random)];
    const jumbled = scrambleWord(answer, wordSet, Math.random);

    const showReady = () => {
      const revealButton = el('button', { class: 'button primary', text: 'Reveal the letters', onclick: showPlaying });
      show(
        stage,
        roundHeader('Conundrum', `Nine jumbled letters hide one word. You have ${ROUND_SECONDS} seconds and as many guesses as you like.`),
        tileRow([], answer.length),
        el('div', { class: 'actions' }, revealButton),
      );
      revealButton.focus();
    };

    const showPlaying = async () => {
      const clock = createClock();
      let solvedWith = null;
      const hint = el('p', { class: 'hint', 'aria-live': 'polite' });
      const input = el('input', {
        class: 'answer-input',
        type: 'text',
        maxlength: answer.length,
        autocomplete: 'off',
        autocapitalize: 'off',
        spellcheck: 'false',
        'aria-label': 'Your guess',
        oninput: () => {
          input.value = input.value.toLowerCase().replace(/[^a-z]/g, '');
          hint.textContent = '';
        },
      });
      const guess = (event) => {
        event.preventDefault();
        if (isSolution(input.value, answer, wordSet)) {
          solvedWith = input.value;
          clock.stop();
        } else {
          hint.textContent = `${input.value.toUpperCase() || 'That'} is not it. Keep going.`;
          input.select();
        }
      };

      show(
        stage,
        roundHeader('Conundrum', 'Unscramble the word.'),
        clock.element,
        tileRow(jumbled),
        el('form', { class: 'answer-form', onsubmit: guess }, input, el('button', { class: 'button primary', type: 'submit', text: 'Guess' })),
        hint,
      );
      input.focus();
      await clock.start();
      showResult(solvedWith);
    };

    const showResult = (solvedWith) => {
      const score = solvedWith ? CONUNDRUM_POINTS : 0;
      const shownWord = solvedWith ?? answer;
      show(
        stage,
        roundHeader('Conundrum', solvedWith ? 'Solved.' : 'Time is up.'),
        tileRow([...shownWord]),
        resultPanel({
          verdict: solvedWith ? `${shownWord.toUpperCase()} is right.` : `The word was ${answer.toUpperCase()}.`,
          score,
          max: CONUNDRUM_POINTS,
          details: [],
          onNext: () => resolve({ label: 'Conundrum', answer: solvedWith ? shownWord.toUpperCase() : 'Not solved', score, max: CONUNDRUM_POINTS }),
        }),
      );
    };

    showReady();
  });
}
