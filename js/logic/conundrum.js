/**
 * Rules for the conundrum round. No screen code lives here.
 */
import { shuffle } from './random.js';

const MAX_SCRAMBLE_ATTEMPTS = 50;

/** Sorts a word's letters so that anagrams share the same key. */
function anagramKey(word) {
  return [...word].sort().join('');
}

/**
 * Jumbles a word's letters. Avoids handing back the answer itself or
 * another real word, which would be confusing.
 * @param {string} word the answer
 * @param {Set<string>} wordSet the dictionary
 * @returns {string[]} the jumbled letters
 */
export function scrambleWord(word, wordSet, rng) {
  let letters = [...word];
  for (let attempt = 0; attempt < MAX_SCRAMBLE_ATTEMPTS; attempt++) {
    letters = shuffle([...word], rng);
    const jumbled = letters.join('');
    if (jumbled !== word && !wordSet.has(jumbled)) break;
  }
  return letters;
}

/**
 * True when the guess is a real word that uses every jumbled letter.
 * @param {string} guess
 * @param {string} answer
 * @param {Set<string>} wordSet the dictionary
 */
export function isSolution(guess, answer, wordSet) {
  return (
    guess.length === answer.length &&
    anagramKey(guess) === anagramKey(answer) &&
    wordSet.has(guess)
  );
}
