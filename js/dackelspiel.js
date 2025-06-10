class Level {
  constructor() {
    this.level = 1;
    this.turns = 1;
    this.size = 4;
  }

  levelUp() {
    if (this.level < 10) {
      this.level++;
    } else if (this.level < 20) {
      this.level++;
      this.size = 5;
    } else if (this.level < 30) {
      this.level++;
      this.size = 6;
    } else if (this.level < 40) {
      this.level++;
      this.turns = 2;
      this.size = 4;
    } else if (this.level < 50) {
      this.level++;
      this.size = 5;
    } else if (this.level < 60) {
      this.level++;
      this.size = 6;
    } else if (this.level < 70) {
      this.level++;
      this.turns = 3;
      this.size = 4;
    } else if (this.level < 80) {
      this.level++;
      this.size = 5;
    } else {
      this.level++;
      this.size = 6;
    }
  }

  getLevel() {
    return this.level;
  }

  getTurns() {
    return this.turns;
  }

  getSize() {
    return this.size;
  }

  reset() {
    this.level = 1;
    this.turns = 1;
    this.size = 4;
  }
}

const levelManager = new Level();
const COLORS = ["#BEC37F", "#EDE3DC"];
const levelDisplay = document.getElementById("level");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlay-text");

let SIZE, MAX_MOVES;
let movesLeft = MAX_MOVES;
let targetField = [];
let playField = [];

const targetContainer = document.getElementById("target-field");
const playContainer = document.getElementById("play-field");
const movesDisplay = document.getElementById("moves");
const resetBtn = document.getElementById("reset-btn");

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createReferenceField(container, fieldData) {
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${SIZE}, 50px)`;

  for (let row = 0; row < SIZE; row++) {
    fieldData[row] = [];
    for (let col = 0; col < SIZE; col++) {
      const state = Math.round(Math.random()); // 0 oder 1
      fieldData[row][col] = state;

      const cell = document.createElement("div");
      cell.className = "cell inactive";

      const inner = document.createElement("div");
      inner.className = "cell-inner";

      const front = document.createElement("div");
      front.className = "front";

      const back = document.createElement("div");
      back.className = "back";

      if (state === 1) cell.classList.add("flipped");

      inner.appendChild(front);
      inner.appendChild(back);
      cell.appendChild(inner);
      container.appendChild(cell);
    }
  }
}

function createPlayField(container, fieldData, referenceField) {
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${SIZE}, 50px)`;

  for (let row = 0; row < SIZE; row++) {
    fieldData[row] = [];
    for (let col = 0; col < SIZE; col++) {
      const state = referenceField[row][col]; // 0 oder 1
      fieldData[row][col] = state;

      const cell = document.createElement("div");
      cell.className = "cell";
      if (state === 1) cell.classList.add("flipped");

      const inner = document.createElement("div");
      inner.className = "cell-inner";

      const front = document.createElement("div");
      front.className = "front";

      const back = document.createElement("div");
      back.className = "back";

      inner.appendChild(front);
      inner.appendChild(back);
      cell.appendChild(inner);

      cell.dataset.row = row;
      cell.dataset.col = col;

      cell.addEventListener("click", () => handleClick(row, col));
      container.appendChild(cell);
    }
  }
}

function scrambleField() {
  const used = new Set();

  for (i = 0; i < MAX_MOVES; i++) {
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);
    const key = `${row},${col}`;

    if (!used.has(key)) {
      turn(row, col);
      used.add(key);
    } else {
        i--;
    }
  }
}

function updatePlayField() {
  const cells = playContainer.children;
  let i = 0;
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      cells[i].style.backgroundColor = playField[row][col];
      i++;
    }
  }
}

function turn(row, col){
  toggleFlip(row, col);
  toggleFlip(row - 1, col);
  toggleFlip(row + 1, col);
  toggleFlip(row, col - 1);
  toggleFlip(row, col + 1);
  toggleFlip(row - 1, col - 1);
  toggleFlip(row + 1, col + 1);
  toggleFlip(row + 1, col - 1);
  toggleFlip(row - 1, col + 1);
}

function toggleFlip(row, col) {
  if (row < 0 || col < 0 || row >= SIZE || col >= SIZE) return;
  const index = row * SIZE + col;
  const cell = playContainer.children[index];
  cell.classList.toggle("flipped");

  // evtl. Spielzustand anpassen, z. B. 0 = front, 1 = back
  playField[row][col] = playField[row][col] === 0 ? 1 : 0;
}

function handleClick(row, col) {
  if (movesLeft <= 0) return;

  toggleFlip(row, col);
  toggleFlip(row - 1, col);
  toggleFlip(row + 1, col);
  toggleFlip(row, col - 1);
  toggleFlip(row, col + 1);
  toggleFlip(row - 1, col - 1);
  toggleFlip(row + 1, col + 1);
  toggleFlip(row + 1, col - 1);
  toggleFlip(row - 1, col + 1);

  movesLeft--;
  movesDisplay.textContent = `Züge übrig: ${movesLeft}`;
  updatePlayField();

  if (checkWin()) {
confetti({
  particleCount: 1000,         // MEHR!
  spread: 110,                // breiter
  startVelocity: 50,          // schneller los
  scalar: 1.5,                // GRÖSSER!
  gravity: 0.6,               // länger in der Luft
  origin: { y: 1.3 },
  colors: ["#BEC37F", "#EDE3DC", "#7C9853", "#D8939F", "#ECCECD"],
  zIndex: 9999
});

  setTimeout(() => {
    levelManager.levelUp();
    resetGame();
  }, 1500);

} else if (movesLeft === 0) {
 overlayText.textContent = `Das war dumm!`;
  overlay.classList.remove("hidden");
overlay.classList.add("visible");

  setTimeout(() => {
    levelManager.reset();
    resetGame();
    overlay.classList.remove("visible");
overlay.classList.add("hidden");
  }, 1200);
}
}
function checkWin() {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (targetField[row][col] !== playField[row][col]) return false;
    }
  }
  return true;
}
function resetGame() {
  SIZE = levelManager.getSize();
  MAX_MOVES = levelManager.getTurns();
  movesLeft = MAX_MOVES;
  movesDisplay.textContent = `Züge übrig: ${movesLeft}`;
  levelDisplay.textContent = `Level: ${levelManager.getLevel()}`;

  playContainer.classList.add("fade-out");
  targetContainer.classList.add("fade-out");

  setTimeout(() => {
    createReferenceField(targetContainer, targetField);
    createPlayField(playContainer, playField, targetField);
    scrambleField();
    updatePlayField();
    playContainer.classList.remove("fade-out");
    targetContainer.classList.remove("fade-out");
  }, 300);
}

resetBtn.addEventListener("click", resetGame);

resetGame();

