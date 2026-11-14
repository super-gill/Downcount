# Downcount user guide

Applies to version 0.1.0.

## Contents

1. [Starting a game](#1-starting-a-game)
2. [Letters round](#2-letters-round)
3. [Numbers round](#3-numbers-round)
4. [Conundrum](#4-conundrum)
5. [Scores](#5-scores)
6. [Controls](#6-controls)
7. [Troubleshooting](#7-troubleshooting)

## 1. Starting a game

The menu offers:

| Option | Rounds | Best score saved |
|---|---|---|
| Quick game | 6: letters, letters, numbers, letters, numbers, conundrum | Yes |
| Full game | 15: eleven letters and numbers rounds in the classic order, ending with a conundrum | Yes |
| Practise one round | 1 of your choice | No |

During a game the strip under the title shows the round you are on and your
score so far. To abandon a game, select the **Downcount** title. The game
returns to the menu and the unfinished game is not scored.

## 2. Letters round

1. Pick nine letters, one at a time, choosing **Vowel** or **Consonant** for
   each. You must end with at least three vowels and at least four
   consonants; a button switches off when that pile is no longer allowed.
2. The clock starts when the ninth letter lands.
3. Type the longest word you can make. Each tile can be used once.
4. Select **Lock in word** to finish early. Otherwise whatever is in the box
   when the clock stops is your answer.

A warning appears while you type if the word uses letters you do not have.
The word is only checked against the dictionary once the round ends.

**Scoring:** one point per letter. A nine-letter word scores 18. A word that
is not in the dictionary, or uses letters you do not have, scores nothing.

After the round the game lists the longest words that were available.

## 3. Numbers round

1. Choose how many large numbers you want, from none to four. Large numbers
   are 25, 50, 75 and 100. The rest of your six are small numbers from 1 to 10.
2. A target from 100 to 999 appears and the clock starts.
3. Build your calculation one step at a time: select a number, then a sign,
   then a second number. The two numbers are replaced by the result, which
   stays selected so you can carry on.
4. Every step must give a whole number above zero. You do not have to use
   all six numbers.
5. **Undo** takes back the last step. **Start again** restores all six
   numbers. **Lock in answer** finishes early.

Your answer is whichever number on your board is closest to the target when
the clock stops.

**Scoring:**

| Distance from target | Points |
|---|---|
| Exact | 10 |
| 1 to 5 away | 7 |
| 6 to 10 away | 5 |
| More than 10 away | 0 |

After the round the game shows one way of reaching the target, or the closest
possible answer if the target cannot be reached.

## 4. Conundrum

1. Select **Reveal the letters** when you are ready. The clock starts at once.
2. Type the nine-letter word and select **Guess**.
3. Wrong guesses cost nothing. Keep guessing until the clock stops.

**Scoring:** 10 points for solving it, nothing otherwise.

## 5. Scores

The summary at the end of a game lists each round with your answer, the
points you won and the most that were possible. Quick game and Full game each
keep your best total. Best scores are stored in your browser on that device
only. Clearing your browser's site data removes them.

## 6. Controls

| Action | Mouse or touch | Keyboard |
|---|---|---|
| Pick a vowel | Vowel button | V |
| Pick a consonant | Consonant button | C |
| Lock in a word or make a guess | Button beside the box | Enter |
| Move on after a round | Continue button | Enter |
| Reach any other button | Select it | Tab, then Enter or Space |
| Clock sounds on or off | Tick box on the menu | Tab, then Space |

The clock ticks during the last five seconds and sounds a low tone when time
runs out.

## 7. Troubleshooting

| Problem | Cause and fix |
|---|---|
| "The dictionary could not be loaded" | The page was opened directly from a folder, or the connection dropped. Use the hosted link, or run it through a web server as described in the README, then reload. |
| No clock sounds | Check the **Clock sounds** tick box on the menu and your device volume. Some browsers stay silent until you have selected something on the page. |
| Best scores have gone | Browser site data was cleared, or you are in a private window or on a different device or browser. |
| A real word was rejected | The built-in dictionary does not contain it. See "Known limitations" in the technical reference. |
