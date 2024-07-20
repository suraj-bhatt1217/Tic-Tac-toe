/*--------- Constants ------------------*/
const squareEls = document.querySelectorAll(".sqr");
const messageEl = document.querySelector("#message");
/*------- Variables (state)-----------*/
let board, turn, winner, tie;
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
    if (cell === "X") {
      squareEls[idx].textContent = "🦉";
      squareEls[idx].classList.add("animate__animated", "animate__flipInX");
      squareEls[idx].style.backgroundColor = "#468189";
    } else if (cell === "O") {
      squareEls[idx].textContent = "🦄";
      squareEls[idx].classList.add("animate__animated", "animate__flipInY");
      squareEls[idx].style.backgroundColor = "#f4e9cd";
    } else {
      squareEls[idx].textContent = "";
      squareEls[idx].style.backgroundColor = "";
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
    messageEl.textContent = `It is ${turn === "X" ? "🦉" : "🦄"}'s turn`;
  } else if (!winner && tie) {
    messageEl.textContent = "Cat's game.  Meow!! 😻";
  } else {
    messageEl.textContent = `${turn === "X" ? "🦉" : "🦄"} wins the game!`;
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
