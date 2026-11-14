/**
 * Rules for the letters round. No screen code lives here.
 * Words and letters are lower case throughout.
 */
import { MAX_CONSONANTS, MAX_VOWELS, RACK_SIZE } from '../config.js';
import { shuffle } from './random.js';

/** How many of each letter go into the two piles. Common letters appear more. */
const VOWEL_COUNTS = { a: 15, e: 21, i: 13, o: 13, u: 5 };
const CONSONANT_COUNTS = {
  b: 2, c: 3, d: 6, f: 2, g: 3, h: 2, j: 1, k: 1, l: 5, m: 4, n: 8,
  p: 4, q: 1, r: 9, s: 9, t: 9, v: 1, w: 1, x: 1, y: 1, z: 1,
};

/** Turns { a: 2, b: 1 } into a shuffled pile such as ['b', 'a', 'a']. */
function buildPile(counts, rng) {
  const letters = Object.entries(counts).flatMap(([letter, count]) =>
    Array(count).fill(letter),
  );
  return shuffle(letters, rng);
}

/** Creates fresh, shuffled vowel and consonant piles to draw from. */
export function createPiles(rng) {
  return {
    vowel: buildPile(VOWEL_COUNTS, rng),
    consonant: buildPile(CONSONANT_COUNTS, rng),
  };
}

/** True for a, e, i, o and u. */
export function isVowel(letter) {
  return letter in VOWEL_COUNTS;
}

/**
 * Says which piles the player may still draw from. The limits guarantee
 * every rack ends with at least three vowels and at least four consonants.
 * @param {string[]} rack letters picked so far
 * @returns {{ vowel: boolean, consonant: boolean }}
 */
export function allowedDraws(rack) {
  const vowels = rack.filter(isVowel).length;
  const consonants = rack.length - vowels;
  const hasRoom = rack.length < RACK_SIZE;
  return {
    vowel: hasRoom && vowels < MAX_VOWELS,
    consonant: hasRoom && consonants < MAX_CONSONANTS,
  };
}

/**
 * True when the word can be spelled using each rack letter at most once.
 * @param {string} word
 * @param {string[]} rack
 */
export function canMakeWord(word, rack) {
  const remaining = [...rack];
  for (const letter of word) {
    const index = remaining.indexOf(letter);
    if (index === -1) return false;
    remaining.splice(index, 1);
  }
  return true;
}

/** One point per letter, doubled for a word that uses the whole rack. */
export function scoreWord(word) {
  return word.length === RACK_SIZE ? RACK_SIZE * 2 : word.length;
}

/**
 * Finds the longest dictionary words the rack can make.
 * @param {string[]} rack
 * @param {string[]} words the full dictionary
 * @param {number} limit how many words to return at most
 * @returns {string[]} longest first, then alphabetical
 */
export function findBestWords(rack, words, limit = 5) {
  return words
    .filter((word) => word.length <= rack.length && canMakeWord(word, rack))
    .sort((a, b) => b.length - a.length || a.localeCompare(b))
    .slice(0, limit);
}
