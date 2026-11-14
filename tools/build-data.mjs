/**
 * Builds the two data files the game loads at start-up.
 *
 *   data/words.txt       every dictionary word of 2 to 9 letters
 *   data/conundrums.txt  nine-letter words suitable as conundrum answers
 *
 * Source dictionary: the "word-list" npm package (MIT licence).
 * Run with:  npm install && npm run build:data
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const MIN_LENGTH = 2;
const MAX_LENGTH = 9;

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

/** Sorts a word's letters so that anagrams share the same key. */
const anagramKey = (word) => [...word].sort().join('');

const sourcePath = require('word-list').default ?? require('word-list');
const words = readFileSync(sourcePath, 'utf8')
  .split('\n')
  .map((word) => word.trim().toLowerCase())
  .filter((word) => /^[a-z]+$/.test(word))
  .filter((word) => word.length >= MIN_LENGTH && word.length <= MAX_LENGTH);

writeFileSync(join(root, 'data', 'words.txt'), words.join('\n') + '\n');

// A conundrum must have exactly one answer, so count how many dictionary
// words share each nine-letter anagram key.
const wordSet = new Set(words);
const anagramCounts = new Map();
for (const word of words) {
  if (word.length !== MAX_LENGTH) continue;
  const key = anagramKey(word);
  anagramCounts.set(key, (anagramCounts.get(key) ?? 0) + 1);
}

const candidates = readFileSync(join(here, 'conundrum-candidates.txt'), 'utf8')
  .split('\n')
  .map((word) => word.trim().toLowerCase())
  .filter(Boolean);

const rejected = [];
const conundrums = [...new Set(candidates)].filter((word) => {
  const ok =
    word.length === MAX_LENGTH &&
    wordSet.has(word) &&
    anagramCounts.get(anagramKey(word)) === 1;
  if (!ok) rejected.push(word);
  return ok;
});

writeFileSync(join(root, 'data', 'conundrums.txt'), conundrums.sort().join('\n') + '\n');

console.log(`words.txt:       ${words.length} words`);
console.log(`conundrums.txt:  ${conundrums.length} words`);
if (rejected.length) console.log(`rejected candidates: ${rejected.join(', ')}`);
