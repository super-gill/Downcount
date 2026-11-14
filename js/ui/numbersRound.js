/**
 * The numbers round screen: choose six numbers, then calculate the target.
 */
import { ROUND_SECONDS } from '../config.js';
import { el, show, wait } from '../dom.js';
import {
  MAX_LARGE, OPERATORS, applyOperation, drawNumbers, drawTarget, scoreAnswer, solve,
} from '../logic/numbers.js';
import { createClock } from './clock.js';
import { resultPanel, roundHeader } from './parts.js';

const PAUSE_BEFORE_CLOCK_MS = 700;

/** Looks up the on-screen symbol for an operator id. */
const symbolFor = (operatorId) => OPERATORS.find(({ id }) => id === operatorId).symbol;

/** Writes a step as text, for example "75 × 4 = 300". */
const describeStep = ({ a, op, b, result }) => `${a} ${symbolFor(op)} ${b} = ${result}`;

/** Returns the value nearest the target. */
const closestTo = (values, target) =>
  values.reduce((best, value) => (Math.abs(value - target) < Math.abs(best - target) ? value : best));

/**
 * Runs one numbers round.
 * @param {HTMLElement} stage where the round is drawn
 * @returns {Promise<{ label: string, answer: string, score: number, max: number }>}
 */
export function playNumbersRound(stage) {
  return new Promise((resolve) => {
    const showChoosing = () => {
      const largeOptions = Array.from({ length: MAX_LARGE + 1 }, (_, count) => count);
      show(
        stage,
        roundHeader('Numbers', 'How many large numbers do you want? The rest of your six will be small.'),
        el('div', { class: 'actions' }, ...largeOptions.map((count) =>
          el('button', {
            class: 'button',
            text: count === 0 ? 'None' : String(count),
            'aria-label': `${count} large numbers`,
            onclick: () => showPlaying(drawNumbers(count, Math.random), drawTarget(Math.random)),
          }),
        )),
      );
    };

    const showPlaying = async (numbers, target) => {
      // The board is the numbers the player can still use. Each calculation
      // removes two tiles and adds one. "history" holds earlier boards for undo.
      let board = numbers.map((value, id) => ({ id, value }));
      let nextId = numbers.length;
      let steps = [];
      let history = [];
      let firstId = null;
      let operatorId = null;
      let running = false;

      const clock = createClock();
      const boardElement = el('div', { class: 'tile-row' });
      const operatorsElement = el('div', { class: 'operators' });
      const stepsElement = el('ol', { class: 'steps' });
      const message = el('p', { class: 'hint', 'aria-live': 'polite' });
      const undoButton = el('button', { class: 'button', text: 'Undo', onclick: () => undo() });
      const resetButton = el('button', { class: 'button', text: 'Start again', onclick: () => reset() });
      const lockInButton = el('button', { class: 'button primary', text: 'Lock in answer', onclick: () => clock.stop() });

      const render = () => {
        show(boardElement, ...board.map((tile) =>
          el('button', {
            class: `tile tile-number tile-button ${tile.id === firstId ? 'selected' : ''}`,
            text: String(tile.value),
            disabled: !running,
            onclick: () => chooseTile(tile),
          }),
        ));
        show(operatorsElement, ...OPERATORS.map(({ id, symbol }) =>
          el('button', {
            class: `operator ${id === operatorId ? 'selected' : ''}`,
            text: symbol,
            disabled: !running || firstId === null,
            onclick: () => { operatorId = id; message.textContent = ''; render(); },
          }),
        ));
        show(stepsElement, ...steps.map((step) => el('li', { text: describeStep(step) })));
        undoButton.disabled = !running || history.length === 0;
        resetButton.disabled = !running || history.length === 0;
        lockInButton.disabled = !running;
      };

      /** Handles a click on a number: pick it, or use it to finish a step. */
      const chooseTile = (tile) => {
        message.textContent = '';
        if (firstId === null || operatorId === null) {
          firstId = tile.id === firstId ? null : tile.id;
        } else if (tile.id !== firstId) {
          calculate(board.find(({ id }) => id === firstId), tile);
        }
        render();
      };

      const calculate = (first, second) => {
        const result = applyOperation(first.value, operatorId, second.value);
        if (result === null) {
          message.textContent = 'That does not give a whole number above zero.';
          return;
        }
        history.push({ board, steps });
        steps = [...steps, { a: first.value, op: operatorId, b: second.value, result }];
        board = [
          ...board.filter(({ id }) => id !== first.id && id !== second.id),
          { id: nextId, value: result },
        ];
        // Leave the new number selected so the player can carry straight on.
        firstId = nextId;
        nextId += 1;
        operatorId = null;
      };

      const undo = () => {
        ({ board, steps } = history.pop());
        firstId = null;
        operatorId = null;
        message.textContent = '';
        render();
      };

      const reset = () => {
        ({ board, steps } = history[0]);
        history = [];
        firstId = null;
        operatorId = null;
        message.textContent = '';
        render();
      };

      show(
        stage,
        roundHeader('Numbers', `Get as close to the target as you can. Pick a number, a sign, then another number. Your closest number after ${ROUND_SECONDS} seconds counts.`),
        clock.element,
        el('p', { class: 'target' }, 'Target ', el('strong', { text: String(target) })),
        boardElement,
        operatorsElement,
        message,
        stepsElement,
        el('div', { class: 'actions' }, undoButton, resetButton, lockInButton),
      );
      render();

      await wait(PAUSE_BEFORE_CLOCK_MS);
      running = true;
      render();
      await clock.start();
      showResult(numbers, target, closestTo(board.map(({ value }) => value), target), steps);
    };

    const showResult = (numbers, target, answer, steps) => {
      const solution = solve(numbers, target);
      const score = scoreAnswer(answer, target);
      const max = scoreAnswer(solution.value, target);
      const distance = Math.abs(answer - target);
      const verdict = distance === 0
        ? `You hit ${target} exactly.`
        : `Your closest number was ${answer}, which is ${distance} away from ${target}.`;
      const solutionIntro = solution.value === target
        ? `One way to reach ${target}:`
        : `${target} cannot be reached. The closest possible is ${solution.value}:`;

      show(
        stage,
        roundHeader('Numbers', 'Time is up.'),
        el('p', { class: 'target' }, 'Target ', el('strong', { text: String(target) })),
        el('div', { class: 'tile-row' }, ...numbers.map((value) => el('span', { class: 'tile tile-number', text: String(value) }))),
        resultPanel({
          verdict,
          score,
          max,
          details: [
            steps.length ? el('p', { text: 'Your working:' }) : null,
            steps.length ? el('ol', { class: 'steps' }, ...steps.map((step) => el('li', { text: describeStep(step) }))) : null,
            el('p', { text: solutionIntro }),
            el('ol', { class: 'steps' }, ...solution.steps.map((step) => el('li', { text: describeStep(step) }))),
          ],
          onNext: () => resolve({ label: 'Numbers', answer: `${answer} for ${target}`, score, max }),
        }),
      );
    };

    showChoosing();
  });
}
