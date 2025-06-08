const COLORS = ["#BEC37F", "#EDE3DC"];
const SIZE = 5;
const MAX_MOVES = 1;

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
    setTimeout(() => alert("🎉 Du hast gewonnen!"), 200);
  } else if (movesLeft === 0) {
    setTimeout(() => alert("⛔ Keine Züge mehr!"), 200);
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
  movesLeft = MAX_MOVES;
  movesDisplay.textContent = `Züge übrig: ${movesLeft}`;
  createReferenceField(targetContainer, targetField);
  createPlayField(playContainer, playField, targetField);
  scrambleField(MAX_MOVES); // Feld "verwirren"
  updatePlayField(); // Anzeige aktualisieren
}

resetBtn.addEventListener("click", resetGame);

resetGame();

