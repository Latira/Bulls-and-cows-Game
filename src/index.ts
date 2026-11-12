import { countPossibleSecrets } from './core/game';

let length = 4;
let base = 10;

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
const timerDisplay = el('div', 'Timer: 0 сек.');
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

// Settings logic
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

baseSelect.addEventListener('change', () => {
  base = Number(baseSelect.value);
  syncSettings();
});

lengthSelect.addEventListener('change', () => {
  length = Number(lengthSelect.value);
  syncSettings();
});

app.append(settingsPanel, gamePanel, boardPanel, footer);
document.body.append(app);
syncSettings();
