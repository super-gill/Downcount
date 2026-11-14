# Downcount

A browser game of letters, numbers and anagrams. Every round runs against a
thirty second clock.

**Play it:** https://super-gill.github.io/Downcount/

| | |
|---|---|
| Current version | 0.1.0 (pre-release) |
| Runs in | Any current desktop or mobile browser |
| Needs | Nothing to install. No account, no server-side code |
| Stores | Best scores and the sound setting, in your browser only |

## What is in the game

- **Letters round.** Pick nine letters, then make the longest word you can.
- **Numbers round.** Pick six numbers, then calculate a three-digit target.
- **Conundrum.** Unscramble one nine-letter word.
- **Quick game** (6 rounds) and **Full game** (15 rounds), each with a saved
  best score, plus single-round practice.

## Documentation

| Document | Who it is for |
|---|---|
| [User guide](docs/USER-GUIDE.md) | Players: rules, scoring, controls, troubleshooting |
| [Technical reference](docs/TECHNICAL-REFERENCE.md) | Anyone changing the code: structure, settings, data, testing, release steps |
| [Changelog](CHANGELOG.md) | What changed in each version |

## Running it on your own computer

The game loads its word list with a web request, so it must be opened through
a web server. Opening `index.html` directly from a folder will show a
"dictionary could not be loaded" message.

You need [Node.js](https://nodejs.org) 20 or later.

```
npm install
npm start
```

Then open the address shown in the terminal.

To run the automated tests:

```
npm test
```

## Third-party material

The dictionary in `data/words.txt` is built from the
[word-list](https://github.com/sindresorhus/word-list) package (MIT licence).
The game uses no other third-party code, fonts, images or sounds.
