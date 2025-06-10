const circle = document.getElementById("circle");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const startBtn = document.getElementById("start-btn");
const gameArea = document.getElementById("game-area");

let score = 0;
let timeLeft = 20;
let gameRunning = false;
let timer;

const colors = ["#BEC37F", "#EDE3DC", "#7C9853", "#D8939F", "#ECCECD"];

function randomPosition() {
  const areaRect = gameArea.getBoundingClientRect();
  const maxX = areaRect.width - 80;
  const maxY = areaRect.height - 80;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  return { x, y };
}

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function showCircle() {
  const pos = randomPosition();
  circle.style.left = `${pos.x}px`;
  circle.style.top = `${pos.y}px`;
  circle.style.backgroundColor = randomColor();
  circle.style.display = "block";
}

circle.addEventListener("click", () => {
  if (!gameRunning) return;
  score++;
  scoreText.textContent = `Score: ${score}`;
  circle.style.display = "none";

  if (timeLeft > 0) {
    showCircle();
  }
});

startBtn.addEventListener("click", () => {
  score = 0;
  timeLeft = 20;
  gameRunning = true;
  scoreText.textContent = "Score: 0";
  timeText.textContent = "Zeit: 20s";
  startBtn.disabled = true;

  showCircle();

  timer = setInterval(() => {
    timeLeft--;
    timeText.textContent = `Zeit: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      gameRunning = false;
      circle.style.display = "none";
      startBtn.disabled = false;
      alert(`Zeit vorbei! Dein Score: ${score}`);
    }
  }, 1000);
});
