/**
 * Rules for the numbers round, plus a solver that finds the best answer.
 * No screen code lives here.
 */
import { randomInt, shuffle } from './random.js';

const LARGE_NUMBERS = [25, 50, 75, 100];
const SMALL_NUMBERS = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];

export const NUMBERS_PER_ROUND = 6;
export const MAX_LARGE = LARGE_NUMBERS.length;

/** The four sums a player may use, with the symbol shown on screen. */
export const OPERATORS = [
  { id: '+', symbol: '+' },
  { id: '-', symbol: '−' },
  { id: '*', symbol: '×' },
  { id: '/', symbol: '÷' },
];

/**
 * Draws six numbers: the requested count of large ones, the rest small.
 * @param {number} largeCount 0 to 4
 * @returns {number[]} large numbers first
 */
export function drawNumbers(largeCount, rng) {
  const large = shuffle(LARGE_NUMBERS, rng).slice(0, largeCount);
  const small = shuffle(SMALL_NUMBERS, rng).slice(0, NUMBERS_PER_ROUND - largeCount);
  return [...large, ...small];
}

/** Picks the three-digit target. */
export function drawTarget(rng) {
  return randomInt(100, 999, rng);
}

/**
 * Works out one step of a calculation.
 * @returns {number|null} the result, or null when the step is not allowed
 *   (the result must be a whole number above zero)
 */
export function applyOperation(a, operatorId, b) {
  let result;
  if (operatorId === '+') result = a + b;
  else if (operatorId === '-') result = a - b;
  else if (operatorId === '*') result = a * b;
  else if (operatorId === '/') result = a / b;
  else return null;
  return Number.isInteger(result) && result > 0 ? result : null;
}

/** 10 points for the exact target, 7 within five, 5 within ten. */
export function scoreAnswer(value, target) {
  const distance = Math.abs(value - target);
  if (distance === 0) return 10;
  if (distance <= 5) return 7;
  if (distance <= 10) return 5;
  return 0;
}

/**
 * Searches every legal calculation for the value closest to the target.
 * It stops early as soon as it reaches the target exactly.
 * @param {number[]} numbers the six starting numbers
 * @param {number} target
 * @returns {{ value: number, steps: { a: number, op: string, b: number, result: number }[] }}
 */
export function solve(numbers, target) {
  let best = { value: numbers[0], steps: [] };

  const consider = (value, steps) => {
    const gap = Math.abs(value - target);
    const bestGap = Math.abs(best.value - target);
    if (gap < bestGap || (gap === bestGap && steps.length < best.steps.length)) {
      best = { value, steps: [...steps] };
    }
  };

  numbers.forEach((value) => consider(value, []));

  /** Tries combining every pair of the remaining numbers, then goes deeper. */
  const search = (remaining, steps) => {
    for (let i = 0; i < remaining.length; i++) {
      for (let j = i + 1; j < remaining.length; j++) {
        // Put the larger number first so subtraction and division stay legal.
        const a = Math.max(remaining[i], remaining[j]);
        const b = Math.min(remaining[i], remaining[j]);
        const rest = remaining.filter((_, index) => index !== i && index !== j);

        for (const { id } of OPERATORS) {
          // Multiplying or dividing by one changes nothing, so skip it.
          if (b === 1 && (id === '*' || id === '/')) continue;
          const result = applyOperation(a, id, b);
          if (result === null) continue;

          steps.push({ a, op: id, b, result });
          consider(result, steps);
          if (best.value === target) return true;
          if (rest.length > 0 && search([...rest, result], steps)) return true;
          steps.pop();
        }
      }
    }
    return false;
  };

  if (best.value !== target) search(numbers, []);
  return best;
}
