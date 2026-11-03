const src = 'https://github.com/Evan0x/hangman/blob/main';

export const hangmanStudy = {
  id: 'hangman',
  number: '04',
  name: 'Hangman',
  kicker: 'Client system',
  category: 'Browser Game / JavaScript',
  stage: 'Four files at the repository root. No server, no build step.',
  repo: 'https://github.com/Evan0x/hangman',
  stack: ['HTML', 'CSS', 'JavaScript'],
  links: [
    { label: 'Repository', href: 'https://github.com/Evan0x/hangman' },
    { label: 'game.js', href: `${src}/game.js` },
  ],
  architecture: {
    kicker: 'Click a stage',
    lede: 'The game is a loop over a word bank. Difficulty is a length filter. Six misses draw the body.',
    nodes: [
      {
        id: 'bank',
        label: 'Word bank',
        plain: 'words.js exports WORD_BANK: 602 entries, each a word plus a category.',
        responsibility: 'Hold the only data file. Categories in the file are Animals, Countries, Fruits, Technology, Food, Science, Movies, and Sports.',
        technology: 'words.js · WORD_BANK',
        decision: 'The README still says 56 words and 7 categories, and points at js/words.js. The running game imports a 602-word file at the repo root.',
        source: { file: 'words.js', href: `${src}/words.js` },
        snippet: `{ "word": "aardvark", "category": "Animals" }`,
      },
      {
        id: 'filter',
        label: 'Difficulty filter',
        plain: 'Easy, medium, and hard keep the same bank and change the length window.',
        responsibility: 'Count letters after removing spaces. Easy ≤ 7, medium 8–10, hard > 10. If a filter is empty, fall back to the full bank.',
        technology: 'game.js · startGame',
        decision: 'Difficulty is not a separate word list. Changing a .diff-btn restarts the game immediately.',
        source: { file: 'game.js', href: `${src}/game.js` },
        snippet: `const len = entry.word.replace(/\\s/g, '').length;
if (currentDiff === 'easy') return len <= 7;
if (currentDiff === 'medium') return len > 7 && len <= 10;
if (currentDiff === 'hard') return len > 10;`,
      },
      {
        id: 'guess',
        label: 'Guess loop',
        plain: 'On-screen keys and physical a–z keys call the same handleGuess.',
        responsibility: 'Ignore repeats and ignore input after gameOver. Correct letters reveal in place. Wrong letters increment the miss count and reveal the next SVG part.',
        technology: 'keydown · .key buttons · guessed Set',
        decision: 'Spaces and other non-letters in the secret word are not guessable; hasWon treats them as already satisfied.',
        source: { file: 'game.js', href: `${src}/game.js` },
        snippet: `function hasWon() {
  return [...secretWord].every((ch) => !/[a-z]/.test(ch) || guessed.has(ch));
}`,
      },
      {
        id: 'gallows',
        label: 'SVG gallows',
        plain: 'Six body parts. The sixth miss marks the head dead and reveals the word.',
        responsibility: 'Toggle .visible on part-head, part-body, part-larm, part-rarm, part-lleg, part-rleg. Overlay copy is YOU WIN! or GAME OVER.',
        technology: 'index.html SVG · style.css · overlay',
        decision: 'Win/lose art is loaded from cdn-icons-png.flaticon.com, not from the repo.',
        source: { file: 'game.js', href: `${src}/game.js` },
        snippet: `const BODY_PARTS = [
  'part-head', 'part-body', 'part-larm',
  'part-rarm', 'part-lleg', 'part-rleg',
];`,
      },
    ],
  },
  flow: {
    lede: 'Pick a length band, draw a word, guess letters, stop at six misses or a full reveal.',
    steps: [
      { id: 'diff', label: 'Difficulty', detail: 'easy / medium / hard' },
      { id: 'draw', label: 'Draw', detail: 'Random bank row' },
      { id: 'input', label: 'Guess', detail: 'Click or keydown' },
      { id: 'hit', label: 'Hit / miss', detail: 'Reveal or draw a part' },
      { id: 'end', label: 'End', detail: 'Overlay, Enter to restart' },
    ],
  },
  apis: [
    {
      id: 'guess',
      title: 'Guess a letter',
      method: 'EVENT',
      path: 'handleGuess(letter)',
      status: 'state',
      note: 'There is no HTTP API. This is the only input surface: a single a–z character, already lowercased.',
      source: { file: 'game.js', href: `${src}/game.js` },
      request: `handleGuess('a')
// from button dataset.letter or keydown e.key`,
      response: `if (secretWord.includes('a')) {
  // mark key .correct, renderWord(), maybe overlay win
} else {
  wrongGuesses += 1
  // mark key .wrong, showNextPart, maybe overlay lose
}`,
    },
  ],
  snippets: [
    {
      id: 'start',
      file: 'game.js',
      href: `${src}/game.js`,
      caption: 'Difficulty is a filter over one bank, with a safety fallback',
      code: `const filteredWords = WORD_BANK.filter((entry) => {
  const len = entry.word.replace(/\\s/g, '').length;
  if (currentDiff === 'easy') return len <= 7;
  if (currentDiff === 'medium') return len > 7 && len <= 10;
  if (currentDiff === 'hard') return len > 10;
  return true;
});
const sourceList = filteredWords.length > 0 ? filteredWords : WORD_BANK;`,
    },
  ],
  beforeAfter: {
    title: 'README vs the files that actually load',
    evidence: 'hangman/README.md compared with the root tree: index.html, game.js, style.css, words.js.',
    before: {
      label: 'README',
      text: 'Describes a js/ folder, words.js under js/, and a bank of 56 words in 7 categories.',
    },
    after: {
      label: 'Repository root',
      text: 'The game files sit at the root. WORD_BANK has 602 words. Eight categories are present; Countries (247), Animals (234), and Fruits (81) dominate, with six smaller eight-word groups.',
    },
  },
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      body: [
        'Hangman is a browser word game. index.html, style.css, game.js, and words.js are enough to run it. There is no backend, no package.json, and no framework.',
        'The player picks easy, medium, or hard, guesses letters with the mouse or keyboard, and has six misses. A category tag is shown for the current word. The overlay uses Enter or a button to start again.',
      ],
    },
    {
      id: 'problem',
      title: 'Problem',
      body: [
        'A hangman clone has to keep state in the page: the secret, the guessed set, the miss count, and whether input is still legal.',
        'This version also has to handle spaces inside phrases, a length-based difficulty, and two input devices without desynchronizing the on-screen keyboard.',
      ],
    },
    {
      id: 'architecture',
      title: 'System Architecture',
      body: [
        'Four files, no modules. words.js defines WORD_BANK. game.js owns state and DOM writes. style.css and inline SVG in index.html draw the gallows.',
        'That is the whole deployable. GitHub hosts the source; this case study does not claim a separate live URL.',
      ],
    },
    {
      id: 'stack',
      title: 'Technology Stack',
      items: [
        'HTML for structure, overlay, difficulty buttons, and the SVG body parts.',
        'CSS for the board, keys, and .visible / .dead gallows states.',
        'JavaScript for state, filtering, and input.',
        'External PNG URLs from flaticon for the win/lose overlay images.',
      ],
    },
    {
      id: 'backend',
      title: 'Backend Design',
      body: [
        'There is no backend. The word list is a client-side array. Anyone who can open the page can read every word.',
        'That is acceptable for a toy hangman set. It would not be acceptable if the bank were meant to stay hidden.',
      ],
    },
    {
      id: 'api',
      title: 'API Design',
      body: [
        'No HTTP. The interface is handleGuess(letter) plus startGame() from New Game, overlay, difficulty, and Enter.',
        'State is module-level lets: secretWord, category, guessed, wrongGuesses, gameOver, currentDiff. Default difficulty is medium.',
      ],
    },
    {
      id: 'pipeline',
      title: 'Data Processing Pipeline',
      body: [
        'startGame filters WORD_BANK by letter count, draws one entry, lowercases the secret, and rebuilds the word row and keyboard.',
        'Each guess is one character. Hits re-render the row. Misses append to the wrong-letter string (sorted) and reveal the next body part. Six misses reveal the remaining letters with .wrong-reveal before the overlay.',
      ],
    },
    {
      id: 'errors',
      title: 'Error Handling and Validation',
      body: [
        'handleGuess returns immediately when the game is over or the letter is already in guessed. keydown ignores anything that is not a single a–z key.',
        'If a difficulty filter matches nothing, the code uses the full bank instead of throwing. showNextPart ignores counts outside 1–6.',
      ],
    },
    {
      id: 'challenges',
      title: 'Engineering Challenges',
      items: [
        'Multi-word secrets: spaces take width in the row but are not letters to guess.',
        'Keeping click and keydown on one guessed Set so a physical key disables the matching button.',
        'Difficulty without splitting the bank into three files.',
        'Docs that drifted from the tree: folder layout and word counts in the README are stale.',
      ],
    },
    {
      id: 'decisions',
      title: 'Technical Decisions',
      items: [
        'One WORD_BANK and a length predicate, not three lists.',
        'Six SVG parts as the life system, hard-coded.',
        'Vanilla files at the root, no bundler.',
        'Show the category during play, so the bank’s labels are part of the game, not hidden metadata.',
      ],
    },
    {
      id: 'future',
      title: 'Future Improvements',
      body: ['Only what the current files already make obvious.'],
      items: [
        'Update the README to the root file layout, 602 words, and eight categories.',
        'Host overlay images in the repo if the flaticon CDN URLs should not be a runtime dependency.',
        'If the word list is ever meant to be a surprise, it cannot ship as a global in words.js.',
      ],
    },
  ],
};
