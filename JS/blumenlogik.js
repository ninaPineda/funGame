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
    container.style.gridTemplateColumns = `repeat(${SIZE}, 50px)`;
  container.innerHTML = "";
  for (let row = 0; row < SIZE; row++) {
    fieldData[row] = [];
    for (let col = 0; col < SIZE; col++) {
      const color = randomColor();
      fieldData[row][col] = color;

      const cell = document.createElement("div");
      cell.className = "cell inactive";
      cell.style.backgroundColor = color;
      container.appendChild(cell);
    }
  }
}

function createPlayField(container, fieldData, referenceField) {
    container.style.gridTemplateColumns = `repeat(${SIZE}, 50px)`;
  container.innerHTML = "";
  for (let row = 0; row < SIZE; row++) {
    fieldData[row] = [];
    for (let col = 0; col < SIZE; col++) {
      const color = referenceField[row][col]; // Start gleich wie Ziel
      fieldData[row][col] = color;

      const cell = document.createElement("div");
      cell.className = "cell";
      cell.style.backgroundColor = color;
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
      toggleColor(row, col);
  toggleColor(row - 1, col);
  toggleColor(row + 1, col);
  toggleColor(row, col - 1);
  toggleColor(row, col + 1);
  toggleColor(row - 1, col - 1);
  toggleColor(row + 1, col + 1);
  toggleColor(row + 1, col - 1);
  toggleColor(row - 1, col + 1);
}

function toggleColor(row, col) {
  if (row < 0 || col < 0 || row >= SIZE || col >= SIZE) return;
  const currentColor = playField[row][col];
  const newIndex = (COLORS.indexOf(currentColor) + 1) % COLORS.length;
  playField[row][col] = COLORS[newIndex];
}

function handleClick(row, col) {
  if (movesLeft <= 0) return;

  toggleColor(row, col);
  toggleColor(row - 1, col);
  toggleColor(row + 1, col);
  toggleColor(row, col - 1);
  toggleColor(row, col + 1);
  toggleColor(row - 1, col - 1);
  toggleColor(row + 1, col + 1);
  toggleColor(row + 1, col - 1);
  toggleColor(row - 1, col + 1);

  movesLeft--;
  movesDisplay.textContent = `Züge übrig: ${movesLeft}`;
  updatePlayField();

  if (checkWin()) {
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.8 }
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

    // Animation: Feld ausblenden
  playContainer.classList.add("fade-out");
  targetContainer.classList.add("fade-out");


  setTimeout(() => {
    createReferenceField(targetContainer, targetField);
    createPlayField(playContainer, playField, targetField);
    scrambleField();
    updatePlayField();

    // Wieder einblenden
    playContainer.classList.remove("fade-out");
    targetContainer.classList.remove("fade-out");
  }, 300); // Zeit passt zu deiner CSS-Transition



  createReferenceField(targetContainer, targetField);
  createPlayField(playContainer, playField, targetField);
  scrambleField();
  updatePlayField();
  levelDisplay.textContent = `Level: ${levelManager.getLevel()}`;
}

resetBtn.addEventListener("click", resetGame);

resetGame();

