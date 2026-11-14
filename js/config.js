/**
 * Game-wide settings. Change values here rather than in the round code.
 */

/** Shown on the menu. Keep in step with package.json and CHANGELOG.md. */
export const VERSION = '0.1.0';

const DEFAULT_ROUND_SECONDS = 30;

/**
 * Reads the optional "?seconds=5" address bar setting, which shortens the
 * clock for testing. Anything missing or invalid falls back to 30.
 */
function readRoundSeconds() {
  const raw = new URLSearchParams(globalThis.location?.search ?? '').get('seconds');
  const seconds = Number.parseInt(raw ?? '', 10);
  return seconds >= 1 && seconds <= 120 ? seconds : DEFAULT_ROUND_SECONDS;
}

/** How long the clock runs in every round. */
export const ROUND_SECONDS = readRoundSeconds();

/** The clock turns red and ticks for this many final seconds. */
export const WARNING_SECONDS = 5;

/** How many letters are drawn in a letters round. */
export const RACK_SIZE = 9;

/** Limits on the mix of letters a player may pick. */
export const MAX_VOWELS = 5;
export const MAX_CONSONANTS = 6;

/** Points for solving the conundrum. */
export const CONUNDRUM_POINTS = 10;

/**
 * Game modes. "rounds" is the running order; "ranked" modes keep a best score.
 */
export const MODES = {
  quick: {
    name: 'Quick game',
    ranked: true,
    rounds: ['letters', 'letters', 'numbers', 'letters', 'numbers', 'conundrum'],
  },
  full: {
    name: 'Full game',
    ranked: true,
    rounds: [
      'letters', 'letters', 'numbers',
      'letters', 'letters', 'numbers',
      'letters', 'letters', 'numbers',
      'letters', 'letters', 'letters', 'letters', 'numbers',
      'conundrum',
    ],
  },
  letters: { name: 'Letters practice', ranked: false, rounds: ['letters'] },
  numbers: { name: 'Numbers practice', ranked: false, rounds: ['numbers'] },
  conundrum: { name: 'Conundrum practice', ranked: false, rounds: ['conundrum'] },
};
