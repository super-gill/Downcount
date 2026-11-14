# Downcount technical reference

Applies to version 0.1.0.

## Contents

1. [Overview](#1-overview)
2. [File structure](#2-file-structure)
3. [How a game runs](#3-how-a-game-runs)
4. [Settings](#4-settings)
5. [Data files](#5-data-files)
6. [Browser storage](#6-browser-storage)
7. [Testing](#7-testing)
8. [Coding standards](#8-coding-standards)
9. [Releasing a new version](#9-releasing-a-new-version)
10. [Known limitations](#10-known-limitations)

## 1. Overview

Downcount is a static website: HTML, CSS and JavaScript files served as
they are. There is no build step, no framework and no server-side code. The
JavaScript uses standard ES modules, which every current browser supports.

Node.js is needed only for development tasks: running the tests, rebuilding
the data files and serving the folder locally.

## 2. File structure

```
index.html                 The single page
css/styles.css             All styling, in numbered sections
js/
  app.js                   Entry point: loads data, runs menu and games
  config.js                Version number, timings, limits, game modes
  dictionary.js            Loads the word lists
  dom.js                   Helper for creating page elements
  sound.js                 Clock tick and time-up tones
  storage.js               Best scores and sound setting
  logic/                   Game rules. No page code, so it can be tested
    random.js              Shuffle and random number helpers
    letters.js             Letter piles, word checking, scoring, best words
    numbers.js             Number draws, calculation rules, scoring, solver
    conundrum.js           Scrambling and guess checking
  ui/                      Everything the player sees
    clock.js               The lamp clock
    parts.js               Tiles, round header, result panel
    lettersRound.js        Letters round screen
    numbersRound.js        Numbers round screen
    conundrumRound.js      Conundrum screen
    screens.js             Menu and end-of-game summary
data/
  words.txt                Dictionary: one word per line, 2 to 9 letters
  conundrums.txt           Conundrum answers: one per line
tools/
  build-data.mjs           Rebuilds both data files
  conundrum-candidates.txt Hand-picked words considered for conundrums
tests/logic.test.js        Automated tests for js/logic
docs/                      This documentation
```

The split between `js/logic` and `js/ui` is deliberate. Rules live in
`logic` and never touch the page; screens live in `ui` and never decide a
rule. To change how something is scored, edit `logic`. To change how it
looks or is operated, edit `ui` or `css/styles.css`.

## 3. How a game runs

1. `app.js` loads the two data files through `dictionary.js`.
2. It shows the menu (`ui/screens.js`).
3. When a mode is chosen, `playGame` looks up that mode's list of rounds in
   `config.js` and plays them in order.
4. Each round is a function (`playLettersRound`, `playNumbersRound`,
   `playConundrumRound`) that draws itself into the page and returns a
   promise. The promise resolves with the round result once the player
   selects **Continue**:

   ```js
   { label: 'Letters', answer: 'STATION', score: 7, max: 9 }
   ```

5. After the last round, `app.js` totals the results, saves a best score for
   ranked modes and shows the summary.

To add a new kind of round, write a function with the same shape, add it to
`ROUND_PLAYERS` in `app.js`, and use its name in a mode's `rounds` list.

### The clock

`ui/clock.js` works out the seconds left from the real time on every check,
instead of counting ticks. This keeps it accurate when a browser slows down
a background tab.

### The numbers solver

`solve` in `logic/numbers.js` tries every legal way of combining the six
numbers and keeps the result closest to the target. It stops as soon as it
finds an exact answer. In testing the slowest case took well under a quarter
of a second.

## 4. Settings

All in `js/config.js`.

| Setting | Default | Effect |
|---|---|---|
| `VERSION` | `0.1.0` | Shown on the menu |
| `ROUND_SECONDS` | 30 | Length of every round |
| `WARNING_SECONDS` | 5 | Final seconds in which the clock turns red and ticks |
| `RACK_SIZE` | 9 | Letters in a letters round |
| `MAX_VOWELS` | 5 | Most vowels a player may pick |
| `MAX_CONSONANTS` | 6 | Most consonants a player may pick |
| `CONUNDRUM_POINTS` | 10 | Points for solving the conundrum |
| `MODES` | | Names, round order and whether a best score is kept |

Letter frequencies are at the top of `js/logic/letters.js`. The number pools
are at the top of `js/logic/numbers.js`.

### Test setting

Adding `?seconds=5` to the address shortens every round to that many seconds
(1 to 120). It is intended for testing and is not offered in the interface.

## 5. Data files

Both files are generated. Do not edit them by hand.

| File | Contents | Source |
|---|---|---|
| `data/words.txt` | About 157,000 lower-case words of 2 to 9 letters | The `word-list` npm package (MIT licence) |
| `data/conundrums.txt` | 144 nine-letter words | `tools/conundrum-candidates.txt`, filtered |

To change the conundrums, edit `tools/conundrum-candidates.txt` and run:

```
npm install
npm run build:data
```

The tool keeps a candidate only if it has exactly nine letters, is in the
dictionary and has no other dictionary word as an anagram, so every
conundrum has one answer. It prints the candidates it rejected.

## 6. Browser storage

One `localStorage` entry, under the key `downcount`:

```json
{ "best": { "quick": 42, "full": 97 }, "sound": true }
```

All reads and writes are wrapped so the game still runs where storage is
blocked; it just does not remember anything.

## 7. Testing

```
npm test
```

runs `tests/logic.test.js` with Node's built-in test runner. The tests cover
the rules in `js/logic` and check both data files. The screens are not
covered by automated tests; check them by playing a quick game with
`?seconds=5`.

## 8. Coding standards

- Plain modern JavaScript (ES modules), no framework and no build step.
- Two-space indentation, single quotes, semicolons, trailing commas.
- `const` by default, `let` only where a value changes.
- Every exported function has a JSDoc comment saying what it does.
- Fixed values are named constants, not numbers buried in the code.
- Rules and screens stay separate (see section 2).
- Version numbers follow [Semantic Versioning](https://semver.org). The game
  stays on 0.x until a full first release.
- Commit messages use the form `type(scope): summary (vX.Y.Z)`.

## 9. Releasing a new version

1. Update the version in `js/config.js` and `package.json`.
2. Add an entry to `CHANGELOG.md`.
3. Update the "Applies to version" line in both documents under `docs/`
   and the version in `README.md`.
4. Run `npm test`.
5. Commit and push to `main`. GitHub Pages republishes the site within a
   minute or two.

## 10. Known limitations

- The dictionary is a general open word list, not an official one. It
  includes many obscure words and may contain offensive ones, which can
  appear in the "longest words available" list. It may also reject some
  words a published dictionary would accept.
- The "longest words available" list is ordered by length, then
  alphabetically. It does not favour common words.
- The solver shows a correct route to the target, not always the shortest.
- A game in progress is not saved. Reloading the page returns to the menu.
- There is no opponent, online play or shared leaderboard.
