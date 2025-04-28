const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

const gridSize = 20;
let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let direction = { x: 0, y: 0 };
let food = { x: gridSize * 7, y: gridSize * 7 };
let gameOver = false;
let score = 0;
let gameLoopInterval;

function drawRoundedRect(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, 8);
  ctx.fill();
}

function drawCircle(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawSnake() {
  snake.forEach((segment) => drawRoundedRect(segment.x, segment.y, gridSize, "#00ff87"));
}

function drawFood() {
  drawCircle(food.x, food.y, gridSize, "tomato");
}

function updateSnake() {
  const head = {
    x: snake[0].x + direction.x * gridSize,
    y: snake[0].y + direction.y * gridSize,
  };


  if (head.x < 0) head.x = canvas.width - gridSize;
  if (head.x >= canvas.width) head.x = 0;
  if (head.y < 0) head.y = canvas.height - gridSize;
  if (head.y >= canvas.height) head.y = 0;

  snake.unshift(head);


  if (head.x === food.x && head.y === food.y) {
    placeFood();
    score++;
    scoreEl.textContent = score;
  } else {
    snake.pop();
  }

  
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver = true;
    }
  }
}

function placeFood() {
  let newFood;
  let isOnSnake;

  do {
    newFood = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
    };

  
    isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);

  } while (isOnSnake); 
  food = newFood;
}


function gameLoop() {
  if (gameOver) {
    clearInterval(gameLoopInterval);
    alert("Game Over! Score: " + score);
    restartGame();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateSnake();
  drawFood();
  drawSnake();
}

function restartGame() {
  snake = [{ x: gridSize * 5, y: gridSize * 5 }];
  direction = { x: 0, y: 0 };
  food = { x: gridSize * 7, y: gridSize * 7 };
  score = 0;
  gameOver = false;
  scoreEl.textContent = score;
  clearInterval(gameLoopInterval);
  gameLoopInterval = setInterval(gameLoop, 200); 
}

function handleKeyPress(key) {
  if (key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
  if (key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
  if (key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
  if (key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
}

document.addEventListener("keydown", (e) => handleKeyPress(e.key));

document.querySelector(".up").onclick = () => handleKeyPress("ArrowUp");
document.querySelector(".down").onclick = () => handleKeyPress("ArrowDown");
document.querySelector(".left").onclick = () => handleKeyPress("ArrowLeft");
document.querySelector(".right").onclick = () => handleKeyPress("ArrowRight");


if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

restartGame();