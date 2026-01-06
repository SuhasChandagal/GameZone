// =====================
// DOM ELEMENTS
// =====================
const holes = document.querySelectorAll(".hole");
const moles = document.querySelectorAll(".mole");
const scoreBoard = document.querySelector(".score");
const game = document.querySelector(".game");

// =====================
// GAME STATE
// =====================
let lastHole = null;
let timeUp = false;
let score = 0;
let currentLevel = "easy";

// =====================
// LEVEL CONFIGURATION
// =====================
const levels = {
  easy: { min: 1000, max: 2000 },
  medium: { min: 600, max: 1200 },
  hard: { min: 300, max: 800 }
};

// =====================
// UTILITY FUNCTIONS
// =====================
function randomTime() {
  const { min, max } = levels[currentLevel];
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];

  if (hole === lastHole) {
    return randomHole(holes);
  }

  lastHole = hole;
  return hole;
}

// =====================
// CORE GAME LOOP
// =====================
function peep() {
  const time = randomTime();
  const hole = randomHole(holes);

  hole.classList.add("up");

  setTimeout(() => {
    hole.classList.remove("up");
    if (!timeUp) peep();
  }, time);
}

// =====================
// LEVEL HANDLING
// =====================
function applyLevelClass() {
  game.classList.remove("easy", "medium", "hard");
  game.classList.add(currentLevel);
}

function setLevel(level) {
  if (!levels[level]) return;
  currentLevel = level;
  applyLevelClass();
}

function autoLevelUp() {
  if (score >= 10 && currentLevel !== "hard") {
    setLevel("hard");
  } else if (score >= 5 && currentLevel === "easy") {
    setLevel("medium");
  }
}

// =====================
// GAME CONTROLS
// =====================
function startGame(level = "easy") {
  score = 0;
  timeUp = false;
  lastHole = null;

  scoreBoard.textContent = 0;
  setLevel(level);

  peep();
  setTimeout(() => (timeUp = true), 10000); // 10 seconds
}

// =====================
// EVENT HANDLERS
// =====================
function bonk(e) {
  if (!e.isTrusted) return; // anti-cheat

  score++;
  this.parentNode.classList.remove("up");
  scoreBoard.textContent = score;

  autoLevelUp();
}

// =====================
// EVENT LISTENERS
// =====================
moles.forEach((mole) => mole.addEventListener("click", bonk));
