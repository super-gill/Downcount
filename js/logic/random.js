/**
 * Random helpers. Every function takes the random source as a parameter
 * (a function returning a number from 0 up to but not including 1) so the
 * tests can pass a predictable one. The game passes Math.random.
 */

/** Returns a whole number from min to max inclusive. */
export function randomInt(min, max, rng) {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Returns a shuffled copy of the list (Fisher-Yates shuffle). */
export function shuffle(list, rng) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(0, i, rng);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
