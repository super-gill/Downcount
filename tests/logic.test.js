import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  allowedDraws, canMakeWord, createPiles, findBestWords, isVowel, scoreWord,
} from '../js/logic/letters.js';
import {
  applyOperation, drawNumbers, drawTarget, scoreAnswer, solve,
} from '../js/logic/numbers.js';
import { isSolution, scrambleWord } from '../js/logic/conundrum.js';

/** A repeatable random source so the tests give the same result every run. */
function seededRng(seed = 1) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const readLines = (path) =>
  readFileSync(new URL(path, import.meta.url), 'utf8').split('\n').filter(Boolean);
const words = readLines('../data/words.txt');
const wordSet = new Set(words);
const conundrums = readLines('../data/conundrums.txt');

test('letters: piles hold only the right kind of letter', () => {
  const piles = createPiles(seededRng());
  assert.ok(piles.vowel.every(isVowel));
  assert.ok(piles.consonant.every((letter) => !isVowel(letter)));
});

test('letters: draw limits force at least 3 vowels and 4 consonants', () => {
  assert.deepEqual(allowedDraws([]), { vowel: true, consonant: true });
  assert.deepEqual(allowedDraws([...'aeiou']), { vowel: false, consonant: true });
  assert.deepEqual(allowedDraws([...'bcdfgh']), { vowel: true, consonant: false });
  assert.deepEqual(allowedDraws([...'aeibcdfgh']), { vowel: false, consonant: false });
});

test('letters: a word may use each rack letter only once', () => {
  const rack = [...'stationer'];
  assert.ok(canMakeWord('station', rack));
  assert.ok(!canMakeWord('stations', rack));
  assert.ok(!canMakeWord('zebra', rack));
});

test('letters: nine-letter words score double', () => {
  assert.equal(scoreWord('cat'), 3);
  assert.equal(scoreWord('stationer'), 18);
});

test('letters: best words are the longest the rack can make', () => {
  const best = findBestWords([...'stationer'], words, 3);
  assert.equal(best[0].length, 9);
  assert.ok(best.every((word) => wordSet.has(word)));
});

test('numbers: draws six numbers with the requested large count', () => {
  for (let large = 0; large <= 4; large++) {
    const numbers = drawNumbers(large, seededRng(large + 1));
    assert.equal(numbers.length, 6);
    assert.equal(numbers.filter((n) => n > 10).length, large);
  }
});

test('numbers: target is three digits', () => {
  const rng = seededRng(7);
  for (let i = 0; i < 200; i++) {
    const target = drawTarget(rng);
    assert.ok(target >= 100 && target <= 999);
  }
});

test('numbers: steps must give a whole number above zero', () => {
  assert.equal(applyOperation(75, '+', 5), 80);
  assert.equal(applyOperation(100, '/', 4), 25);
  assert.equal(applyOperation(5, '-', 5), null);
  assert.equal(applyOperation(3, '-', 7), null);
  assert.equal(applyOperation(7, '/', 2), null);
});

test('numbers: scoring bands', () => {
  assert.equal(scoreAnswer(500, 500), 10);
  assert.equal(scoreAnswer(495, 500), 7);
  assert.equal(scoreAnswer(510, 500), 5);
  assert.equal(scoreAnswer(511, 500), 0);
});

test('numbers: solver finds an exact answer and its steps add up', () => {
  const solution = solve([25, 50, 75, 100, 3, 6], 952);
  assert.equal(solution.value, 952);
  for (const step of solution.steps) {
    assert.equal(applyOperation(step.a, step.op, step.b), step.result);
  }
  assert.equal(solution.steps.at(-1).result, 952);
});

test('numbers: solver returns the closest value when exact is impossible', () => {
  const solution = solve([1, 1, 2, 2, 3, 3], 999);
  assert.ok(solution.value < 999);
  assert.ok(solution.value > 0);
});

test('conundrum: every answer is in the dictionary', () => {
  assert.ok(conundrums.length >= 100);
  assert.ok(conundrums.every((word) => word.length === 9 && wordSet.has(word)));
});

test('conundrum: scramble keeps the letters but hides the word', () => {
  const rng = seededRng(3);
  for (const answer of conundrums) {
    const jumbled = scrambleWord(answer, wordSet, rng).join('');
    assert.notEqual(jumbled, answer);
    assert.ok(isSolution(answer, jumbled, wordSet));
  }
});

test('conundrum: wrong guesses are rejected', () => {
  assert.ok(isSolution('butterfly', 'butterfly', wordSet));
  assert.ok(!isSolution('butterfli', 'butterfly', wordSet));
  assert.ok(!isSolution('flybutter', 'butterfly', wordSet));
});
