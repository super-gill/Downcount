/**
 * Entry point. Loads the word lists, then runs the menu and the games.
 */
import { MODES } from './config.js';
import { loadDictionary } from './dictionary.js';
import { el, show } from './dom.js';
import { saveBestScore } from './storage.js';
import { playConundrumRound } from './ui/conundrumRound.js';
import { playLettersRound } from './ui/lettersRound.js';
import { playNumbersRound } from './ui/numbersRound.js';
import { showMenu, showSummary } from './ui/screens.js';

/** Which function plays each kind of round. */
const ROUND_PLAYERS = {
  letters: playLettersRound,
  numbers: playNumbersRound,
  conundrum: playConundrumRound,
};

const stage = document.querySelector('#stage');
const statusBar = document.querySelector('#status');
let dictionary = null;

/** Updates the strip under the title. Pass nothing to clear it. */
function setStatus(progress = '', score = '') {
  statusBar.hidden = progress === '';
  statusBar.querySelector('#status-progress').textContent = progress;
  statusBar.querySelector('#status-score').textContent = score;
}

function openMenu() {
  setStatus();
  showMenu(stage, playGame);
}

/** Plays every round of a mode in order, then shows the summary. */
async function playGame(modeId) {
  const mode = MODES[modeId];
  const results = [];

  for (const [index, roundType] of mode.rounds.entries()) {
    const score = results.reduce((sum, result) => sum + result.score, 0);
    setStatus(`${mode.name}, round ${index + 1} of ${mode.rounds.length}`, `Score ${score}`);
    results.push(await ROUND_PLAYERS[roundType](stage, dictionary));
  }

  const total = results.reduce((sum, result) => sum + result.score, 0);
  setStatus();
  showSummary(stage, {
    modeName: mode.name,
    results,
    isNewBest: mode.ranked && saveBestScore(modeId, total),
    onPlayAgain: () => playGame(modeId),
    onMenu: openMenu,
  });
}

async function main() {
  show(stage, el('p', { class: 'intro', text: 'Loading the dictionary…' }));
  try {
    dictionary = await loadDictionary();
  } catch (error) {
    console.error(error);
    show(stage, el('p', {
      class: 'intro',
      text: 'The dictionary could not be loaded. If you opened index.html straight from a folder, run the game through a web server instead. The README explains how.',
    }));
    return;
  }
  openMenu();
}

main();
