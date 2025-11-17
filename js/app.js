/*--------- Constants ------------------*/
const squareEls = document.querySelectorAll(".sqr");
const messageEl = document.querySelector("#message");
/*------- Variables (state)-----------*/
let board, turn, winner, tie;
let xEmoji = "🦉";
let oEmoji = "🦄";
const winning_combos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const gameOverSound = new Audio("./assets/gameover.wav");
const turnSound = new Audio("./assets/turnsound.mp3");
const winSound = new Audio("./assets/gamewin.mp3");

/*--------- Cached Element References -------*/

/*---------- Functions -------------*/
init();
function init() {
  //   console.log("init just got invoked.");
  squareEls.forEach((squareEl) => {
    squareEl.className = "sqr";
  });
  board = ["", "", "", "", "", "", "", "", ""];
  turn = "X";
  winner = false;
  tie = false;
  render();
}

function render() {
  updateBoard();
  getMessage();
}

function updateBoard() {
  board.forEach((cell, idx) => {
    const square = squareEls[idx];
    square.classList.remove("x-mark", "o-mark");
    
    if (cell === "X") {
      square.textContent = xEmoji;
      square.classList.add("animate__animated", "animate__flipInX", "x-mark");
    } else if (cell === "O") {
      square.textContent = oEmoji;
      square.classList.add("animate__animated", "animate__flipInY", "o-mark");
    } else {
      square.textContent = "";
    }
  });
}
function handleClick(e) {
  const sqIdx = parseInt(e.target.id);
  if (board[sqIdx] !== "" || winner) {
    return;
  }
  board[sqIdx] = turn;
  getWinner();
  getTie();
  render();
  if (!winner && !tie) {
    turn = turn === "X" ? "O" : "X"; // Switch turns
    turnSound.play();
  }
}

function getMessage() {
  if (!winner && !tie) {
    messageEl.textContent = `It is ${turn === "X" ? xEmoji : oEmoji}'s turn`;
  } else if (!winner && tie) {
    messageEl.textContent = "Cat's game.  Meow!! 😻";
  } else {
    messageEl.textContent = `${turn === "X" ? xEmoji : oEmoji} wins the game!`;
  }
}

function getWinner() {
  winning_combos.forEach((combination) => {
    if (
      board[combination[0]] === board[combination[1]] &&
      board[combination[0]] === board[combination[2]] &&
      board[combination[0]] !== ""
    ) {
      winner = true;
      winSound.play();
      confetti.start(1000);
    }
  });
}

function getTie() {
  if (!board.includes("") && !winner) {
    tie = true;
    gameOverSound.play();
  }
}

function reset() {
  init();
}
/*----------- Event Listeners ---------------*/
squareEls.forEach((select) => {
  select.addEventListener("click", handleClick);
});

document.getElementById("reset").addEventListener("click", reset);

/*----------- Theme Toggle ---------------*/
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Load saved theme preference
const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") {
  body.classList.add("light-theme");
  themeToggle.textContent = "☀️";
} else {
  themeToggle.textContent = "🌙";
}

// Theme toggle functionality
themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-theme");
  const isLight = body.classList.contains("light-theme");
  themeToggle.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

/*----------- Emoji Picker ---------------*/
const emojiPickerBtn = document.getElementById("emoji-picker-btn");
const emojiModal = document.getElementById("emoji-modal");
const emojiCloseBtn = document.getElementById("emoji-close");
const emojiSaveBtn = document.getElementById("emoji-save");
const xEmojiInput = document.getElementById("x-emoji");
const oEmojiInput = document.getElementById("o-emoji");
const emojiSuggestions = document.querySelectorAll(".emoji-suggestion");

// Load saved emojis
const savedXEmoji = localStorage.getItem("xEmoji");
const savedOEmoji = localStorage.getItem("oEmoji");
if (savedXEmoji) {
  xEmoji = savedXEmoji;
  xEmojiInput.value = savedXEmoji;
}
if (savedOEmoji) {
  oEmoji = savedOEmoji;
  oEmojiInput.value = savedOEmoji;
}

// Open emoji picker
emojiPickerBtn.addEventListener("click", () => {
  emojiModal.classList.add("show");
  xEmojiInput.value = xEmoji;
  oEmojiInput.value = oEmoji;
});

// Close emoji picker
emojiCloseBtn.addEventListener("click", () => {
  emojiModal.classList.remove("show");
});

// Close when clicking outside modal
emojiModal.addEventListener("click", (e) => {
  if (e.target === emojiModal) {
    emojiModal.classList.remove("show");
  }
});

// Emoji suggestion clicks
emojiSuggestions.forEach((suggestion) => {
  suggestion.addEventListener("click", () => {
    const emoji = suggestion.getAttribute("data-emoji");
    const parentSection = suggestion.closest(".emoji-section");
    const xInput = parentSection.querySelector("#x-emoji");
    if (xInput) {
      xEmojiInput.value = emoji;
    } else {
      oEmojiInput.value = emoji;
    }
  });
});

// Save emojis
emojiSaveBtn.addEventListener("click", () => {
  const newXEmoji = xEmojiInput.value.trim() || "🦉";
  const newOEmoji = oEmojiInput.value.trim() || "🦄";
  
  xEmoji = newXEmoji;
  oEmoji = newOEmoji;
  
  localStorage.setItem("xEmoji", xEmoji);
  localStorage.setItem("oEmoji", oEmoji);
  
  emojiModal.classList.remove("show");
  render(); // Update the board with new emojis
});

// Allow Enter key to save
xEmojiInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    emojiSaveBtn.click();
  }
});

oEmojiInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    emojiSaveBtn.click();
  }
});
