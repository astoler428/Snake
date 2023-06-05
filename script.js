let canvas = document.getElementById("snake-board");
let ctx = canvas.getContext("2d");

let restartBtn = document.getElementById("restart");
let scoreDiv = document.getElementById("score");

restartBtn.addEventListener("click", restartGame);
window.addEventListener("keydown", changeDirection);

const width = canvas.width;
const height = canvas.height;
const snakeColor = "green";
const foodColor = "red";
const snakeBorder = "black";
const unitSize = 25;

let running = true;
let gameID;
let food;
let score = 0;
let moveFrequency = 140; //milliseconds
let snake = [];
let moves = [{ shiftX: unitSize, shiftY: 0 }];

startGame();

function startGame() {
  createSnake();
  createFood();
  tick();
  gameID = setInterval(tick, moveFrequency);
}

function tick() {
  if (running) {
    clearBoard();
    drawFood();
    moveSnake();
    drawSnake();
  } else clearInterval(gameID);
}

function moveSnake() {
  console.log(snake);
  if (moves.length > 1) {
    moves.shift();
  }

  let head = bodyPart(
    snake[0].x + moves[0].shiftX,
    snake[0].y + moves[0].shiftY
  );
  snake.unshift(head);

  checkGameOver(head);
  if (!foodCollision()) snake.pop();
}

function checkGameOver(head) {
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  )
    return (running = false);

  for (let i = 1; i < snake.length; i++)
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y)
      return (running = false);
}

function foodCollision() {
  if (snake[0].x === food.x && snake[0].y === food.y) {
    score++;
    scoreDiv.innerHTML = score;
    createFood();
    moveFrequency -= 5;
    return true;
  } else return false;
}

function createSnake() {
  for (let part = 4; part >= 0; part--)
    snake.push(bodyPart(unitSize * part, 0));
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorder;
  snake.forEach((bodyPart) => {
    ctx.fillRect(bodyPart.x, bodyPart.y, unitSize, unitSize);
    ctx.strokeRect(bodyPart.x, bodyPart.y, unitSize, unitSize);
  });
}

function clearBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function bodyPart(x, y) {
  return { x: x, y: y };
}

function createFood() {
  let foodX = Math.floor(12 * Math.random()) * unitSize;
  let foodY = Math.floor(12 * Math.random()) * unitSize;
  food = { x: foodX, y: foodY };
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x, food.y, unitSize, unitSize);
}

function changeDirection(event) {
  switch (true) {
    case event.key === "ArrowLeft" && moves[moves.length - 1].shiftX === 0:
      moves.push({ shiftX: -1 * unitSize, shiftY: 0 });
      break;
    case event.key === "ArrowRight" && moves[moves.length - 1].shiftX === 0:
      moves.push({ shiftX: unitSize, shiftY: 0 });
      break;
    case event.key === "ArrowUp" && moves[moves.length - 1].shiftY === 0:
      moves.push({ shiftX: 0, shiftY: -1 * unitSize });
      break;
    case event.key === "ArrowDown" && moves[moves.length - 1].shiftY === 0:
      moves.push({ shiftX: 0, shiftY: unitSize });
      break;
  }
}

function restartGame() {
  snake = [];
  score = 0;
  scoreDiv.innerHTML = score;
  moves = [{ shiftX: unitSize, shiftY: 0 }];
  moveFrequency = 140;
  running = true;
  startGame();
}
