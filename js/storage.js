/**
 * Remembers best scores and the sound setting in the browser.
 * Storage can be unavailable (private browsing, blocked cookies), so every
 * read and write is wrapped and quietly falls back to "nothing saved".
 */

const KEY = 'downcount';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Nothing to do: the game still works, it just will not remember.
  }
}

/** Returns the best score for a mode, or null if none is saved. */
export function getBestScore(modeId) {
  return readAll().best?.[modeId] ?? null;
}

/**
 * Saves the score if it beats the saved best.
 * @returns {boolean} true when it is a new best
 */
export function saveBestScore(modeId, score) {
  const data = readAll();
  const previous = data.best?.[modeId] ?? null;
  if (previous !== null && score <= previous) return false;
  data.best = { ...data.best, [modeId]: score };
  writeAll(data);
  return true;
}

/** Sound is on unless the player has turned it off. */
export function isSoundOn() {
  return readAll().sound !== false;
}

export function setSoundOn(on) {
  writeAll({ ...readAll(), sound: on });
}
