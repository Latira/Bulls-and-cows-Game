import {
  countPossibleSecrets,
  evaluateGuess,
  generateSecret,
  GuessResult,
} from './core/game';
import { createDigitValidator, isValidGuess } from './core/validators';

interface Attempt extends GuessResult {
  guess: string;
}

interface ScoreRecord {
  attempts: number;
  timeSec: number;
  length: number;
  base: number;
}

const STORAGE_KEY = 'bulls-and-cows-leaderboard';

let length = 4;
let base = 10;
let secret = '';
let attempts: Attempt[] = [];
let startTime = 0;
let timerId: number | null = null;
let isPlaying = false;

const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text = '',
  className = ''
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
};

// Main Screen
const app = el('main');
app.append(el('h1', 'Bulls and Cows'));

// Settings Panel
const settingsPanel = el('section', '', 'panel');
const settingsRow = el('div', '', 'row');

const baseSelect = el('select');
[
  { value: 2, label: 'Binary (2)' },
  { value: 8, label: 'Octal (8)' },
  { value: 10, label: 'Decimal (10)' },
  { value: 16, label: 'Hexadecimal (16)' },
].forEach((opt) => {
  const option = el('option', opt.label);
  option.value = String(opt.value);
  if (opt.value === base) option.selected = true;
  baseSelect.append(option);
});

const lengthSelect = el('select');
[2, 3, 4, 5, 6].forEach((len) => {
  const option = el('option', `Length: ${len}`);
  option.value = String(len);
  if (len === length) option.selected = true;
  lengthSelect.append(option);
});

const startBtn = el('button', 'Start Game');
const resetBtn = el('button', 'New Game');
const combinationsInfo = el('div');

settingsRow.append(baseSelect, lengthSelect, startBtn, resetBtn);
settingsPanel.append(settingsRow, combinationsInfo);

// Game Panel
const gamePanel = el('section', '', 'panel');
const timerDisplay = el('div', 'Timer: 0 sec.');
const inputRow = el('div', '', 'row');

const guessInput = el('input');
guessInput.placeholder = 'Enter a number...';
guessInput.disabled = true;

const checkBtn = el('button', 'Check');
checkBtn.disabled = true;

const statusMsg = el('div', '', 'error');
const historyList = el('ul');

inputRow.append(guessInput, checkBtn);
gamePanel.append(timerDisplay, inputRow, statusMsg, historyList);

// Records Panel
const boardPanel = el('section', '', 'panel');
boardPanel.append(el('h2', 'Top-5 Records'));
const boardList = el('ol');
boardList.append(el('li', 'No finished games yet'));
boardPanel.append(boardList);

// Footer
const footer = el('footer');
const authorLink = el('a', 'Latira');
authorLink.href = 'https://github.com/Latira';
authorLink.target = '_blank';
const schoolLink = el('a', 'RS School');
schoolLink.href = 'https://rs.school/';
schoolLink.target = '_blank';
footer.append('Task by ', authorLink, ' for ', schoolLink);

// LocalStorage Records
const loadRecords = (): ScoreRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScoreRecord[]) : [];
  } catch {
    return [];
  }
};

const renderLeaderboard = () => {
  boardList.replaceChildren();
  const records = loadRecords();

  if (records.length === 0) {
    boardList.append(el('li', 'No finished games yet'));
    return;
  }

  records.forEach((rec) => {
    boardList.append(
      el(
        'li',
        `Attempts: ${rec.attempts} | Time: ${rec.timeSec}s | Length: ${rec.length}, Base: ${rec.base}`
      )
    );
  });
};

const saveRecord = (record: ScoreRecord) => {
  const updated = [...loadRecords(), record]
    .sort((a, b) => a.attempts - b.attempts || a.timeSec - b.timeSec)
    .slice(0, 5);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  renderLeaderboard();
};

// Main logic
const syncSettings = () => {
  const isBinary = base === 2;
  Array.from(lengthSelect.options).forEach((opt) => {
    opt.disabled = isBinary && Number(opt.value) !== 2;
  });

  if (isBinary && length !== 2) {
    length = 2;
    lengthSelect.value = '2';
  }

  const total = countPossibleSecrets(length, base);
  combinationsInfo.textContent = `Possible combinations: ${total}`;
};

const stopTimer = () => {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
};

const startGame = () => {
  stopTimer();
  secret = generateSecret(length, base);
  attempts = [];
  isPlaying = true;
  startTime = Date.now();

  baseSelect.disabled = true;
  lengthSelect.disabled = true;
  startBtn.disabled = true;
  guessInput.disabled = false;
  checkBtn.disabled = false;
  guessInput.value = '';
  guessInput.maxLength = length;
  statusMsg.textContent = '';
  statusMsg.className = 'error';
  historyList.replaceChildren();
  timerDisplay.textContent = 'Timer: 0 sec.';

  timerId = window.setInterval(() => {
    const sec = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `Timer: ${sec} sec.`;
  }, 1000);

  guessInput.focus();
};

const resetGame = () => {
  stopTimer();
  isPlaying = false;
  secret = '';
  attempts = [];

  baseSelect.disabled = false;
  lengthSelect.disabled = false;
  startBtn.disabled = false;
  guessInput.disabled = true;
  checkBtn.disabled = true;
  guessInput.value = '';
  statusMsg.textContent = '';
  statusMsg.className = 'error';
  historyList.replaceChildren();
  timerDisplay.textContent = 'Timer: 0 sec.';
  syncSettings();
};

const handleGuess = () => {
  if (!isPlaying) return;
  const guess = guessInput.value.trim();

  if (!isValidGuess(guess, length, base)) {
    statusMsg.textContent = `Please enter ${length} unique valid characters.`;
    return;
  }

  const normalized = guess.toLowerCase();
  if (attempts.some((item) => item.guess.toLowerCase() === normalized)) {
    statusMsg.textContent = 'You already tried this combination!';
    return;
  }

  statusMsg.textContent = '';
  const result = evaluateGuess(secret, guess);
  attempts = [...attempts, { guess, ...result }];

  const li = el(
    'li',
    `#${attempts.length}: ${guess.toUpperCase()} — Bulls: ${result.bulls}, Cows: ${result.cows}`
  );
  historyList.prepend(li);
  guessInput.value = '';

  if (result.bulls === length) {
    isPlaying = false;
    stopTimer();
    guessInput.disabled = true;
    checkBtn.disabled = true;
    const elapsedSec = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    statusMsg.className = 'win';
    statusMsg.textContent = `Victory! Secret: ${secret.toUpperCase()}. Attempts: ${attempts.length}, time: ${elapsedSec} sec.`;
    saveRecord({
      attempts: attempts.length,
      timeSec: elapsedSec,
      length,
      base,
    });
  }
};

baseSelect.addEventListener('change', () => {
  base = Number(baseSelect.value);
  syncSettings();
});

lengthSelect.addEventListener('change', () => {
  length = Number(lengthSelect.value);
  syncSettings();
});

guessInput.addEventListener('input', () => {
  const isDigitAllowed = createDigitValidator(base);
  const filtered = guessInput.value
    .split('')
    .filter((char) => isDigitAllowed(char))
    .join('')
    .slice(0, length);

  if (guessInput.value !== filtered) {
    guessInput.value = filtered;
  }
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
checkBtn.addEventListener('click', handleGuess);
guessInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleGuess();
});

app.append(settingsPanel, gamePanel, boardPanel, footer);
document.body.append(app);

syncSettings();
renderLeaderboard();
