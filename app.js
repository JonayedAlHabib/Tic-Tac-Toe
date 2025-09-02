let resetBtn = document.querySelector("#reset-btn");
let box = document.querySelectorAll(".box");
let newBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let turnIndicator = document.querySelector("#turn-indicator");

let scoreOEl = document.querySelector("#score-o");
let scoreXEl = document.querySelector("#score-x");
let themeBtn = document.querySelector("#theme-btn");

let symbolOInput = document.querySelector("#symbol-o");
let symbolXInput = document.querySelector("#symbol-x");
let applySymbolsBtn = document.querySelector("#apply-symbols");

let timerEl = document.querySelector("#timer");
let timeLeft = 10;
let timer;

let turnO = true;
let scoreO = 0;
let scoreX = 0;

let symbolO = "O";
let symbolX = "X";

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

// Reset game
const resetGame = () => {
  turnO = true;
  enableBoxes();
  msgContainer.classList.add("hide");
  turnIndicator.innerText = `Player ${symbolO}’s Turn`;
  resetTimer();
};

// Timer
const startTimer = () => {
  clearInterval(timer);
  timeLeft = 10;
  timerEl.innerText = `Time Left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `Time Left: ${timeLeft}s`;
    if (timeLeft === 0) {
      turnO = !turnO;
      turnIndicator.innerText = `Player ${turnO ? symbolO : symbolX}’s Turn`;
      resetTimer();
    }
  }, 1000);
};

const resetTimer = () => {
  clearInterval(timer);
  startTimer();
};

// Click on boxes
box.forEach((b) => {
  b.addEventListener("click", () => {
    if (turnO) {
      b.innerText = symbolO;
      turnO = false;
      turnIndicator.innerText = `Player ${symbolX}’s Turn`;
    } else {
      b.innerText = symbolX;
      turnO = true;
      turnIndicator.innerText = `Player ${symbolO}’s Turn`;
    }
    b.disabled = true;
    checkWinner();
    resetTimer();
  });
});

// Enable boxes
const enableBoxes = () => {
  for (let b of box) {
    b.disabled = false;
    b.innerText = "";
    b.classList.remove("winner");
  }
};

// Disable boxes
const disableBoxes = () => {
  for (let b of box) {
    b.disabled = true;
  }
};

// Show winner
const showWinner = (winner) => {
  msg.innerText = `🎉 Winner is ${winner}! 🎉`;
  msgContainer.classList.remove("hide");

  if (winner === symbolO) {
    scoreO++;
    scoreOEl.innerText = scoreO;
    localStorage.setItem("scoreO", scoreO);
  } else if (winner === symbolX) {
    scoreX++;
    scoreXEl.innerText = scoreX;
    localStorage.setItem("scoreX", scoreX);
  }

  disableBoxes();
  clearInterval(timer);
};

// Check winner or draw
const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = box[pattern[0]].innerText;
    let pos2Val = box[pattern[1]].innerText;
    let pos3Val = box[pattern[2]].innerText;

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        box[pattern[0]].classList.add("winner");
        box[pattern[1]].classList.add("winner");
        box[pattern[2]].classList.add("winner");
        showWinner(pos1Val);
        return;
      }
    }
  }

  // Check for draw
  let allFilled = true;
  box.forEach((b) => {
    if (b.innerText === "") {
      allFilled = false;
    }
  });

  if (allFilled) {
    msg.innerText = "It's a Draw!";
    msgContainer.classList.remove("hide");
    clearInterval(timer);
  }
};

// Theme toggle
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Apply custom symbols
applySymbolsBtn.addEventListener("click", () => {
  symbolO = symbolOInput.value || "O";
  symbolX = symbolXInput.value || "X";
  resetGame();
});

// Load scores from local storage
window.onload = () => {
  scoreO = parseInt(localStorage.getItem("scoreO")) || 0;
  scoreX = parseInt(localStorage.getItem("scoreX")) || 0;
  scoreOEl.innerText = scoreO;
  scoreXEl.innerText = scoreX;
  resetGame();
};

newBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
