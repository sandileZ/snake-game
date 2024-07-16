const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gridSize = 20;
let gridCount;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let gameInterval;
let score = 0;
let gameRunning = false;

document.addEventListener('keydown', changeDirection);
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('pauseButton').addEventListener('click', pauseGame);
document.getElementById('upButton').addEventListener('click', () => changeDirection({ keyCode: 38 }));
document.getElementById('downButton').addEventListener('click', () => changeDirection({ keyCode: 40 }));
document.getElementById('leftButton').addEventListener('click', () => changeDirection({ keyCode: 37 }));
document.getElementById('rightButton').addEventListener('click', () => changeDirection({ keyCode: 39 }));
window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
    const canvasSize = Math.min(window.innerWidth - 40, window.innerHeight - 160);
    const oldGridCount = gridCount;

    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    gridCount = Math.floor(canvas.width / gridSize);

    // Adjust positions based on new grid count
    const scaleFactor = gridCount / oldGridCount || 1;
    snake.forEach(segment => {
        segment.x = Math.floor(segment.x * scaleFactor);
        segment.y = Math.floor(segment.y * scaleFactor);
    });

    food.x = Math.floor(food.x * scaleFactor);
    food.y = Math.floor(food.y * scaleFactor);

    drawGame();
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        direction = { x: 1, y: 0 }; // Set initial direction to right
        gameInterval = setInterval(gameLoop, 100);
        document.getElementById('startButton').disabled = true;
        document.getElementById('pauseButton').disabled = false;
    }
}

function pauseGame() {
    if (gameRunning) {
        gameRunning = false;
        clearInterval(gameInterval);
        document.getElementById('startButton').disabled = false;
        document.getElementById('pauseButton').disabled = true;
    }
}

function changeDirection(event) {
    const { keyCode } = event;
    if (keyCode === 37 && direction.x === 0) direction = { x: -1, y: 0 };
    if (keyCode === 38 && direction.y === 0) direction = { x: 0, y: -1 };
    if (keyCode === 39 && direction.x === 0) direction = { x: 1, y: 0 };
    if (keyCode === 40 && direction.y === 0) direction = { x: 0, y: 1 };
}

function gameLoop() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameInterval);
        alert(`Game Over! Your score is ${score}`);
        resetGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }

    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
}

function drawSnake() {
    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * gridCount),
        y: Math.floor(Math.random() * gridCount)
    };

    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        placeFood();
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = { x: 15, y: 15 };
    score = 0;
    gameRunning = false;
    document.getElementById('startButton').disabled = false;
    document.getElementById('pauseButton').disabled = true;
    drawGame();
}

document.getElementById('pauseButton').disabled = true;
resizeCanvas();
