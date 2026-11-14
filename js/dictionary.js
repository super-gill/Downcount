/**
 * Loads the word lists the game needs.
 */

/** Fetches a text file and returns its non-empty lines. */
async function loadLines(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`);
  const text = await response.text();
  return text.split('\n').filter(Boolean);
}

/**
 * Loads the dictionary and the conundrum answers.
 * @returns {Promise<{ words: string[], wordSet: Set<string>, conundrums: string[] }>}
 *   "words" for searching, "wordSet" for quick is-this-a-word checks
 */
export async function loadDictionary() {
  const [words, conundrums] = await Promise.all([
    loadLines('data/words.txt'),
    loadLines('data/conundrums.txt'),
  ]);
  return { words, wordSet: new Set(words), conundrums };
}
