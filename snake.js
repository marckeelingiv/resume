document.addEventListener('DOMContentLoaded', () => {
    // SQL Snake Game Modal
    const sqlSnakeModal = document.getElementById('sqlSnakeModal');
    const sqlSnakeBtn = document.getElementById('sqlSnakeBtn');
    const mobileSqlSnakeBtn = document.getElementById('mobileSqlSnakeBtn');
    const closeSqlSnakeModal = document.getElementById('closeSqlSnakeModal');

    function openSqlSnakeModal() {
        if (sqlSnakeModal) {
            sqlSnakeModal.classList.add('active');
        }
    }

    function closeSqlSnakeModalFunc() {
        if (sqlSnakeModal) {
            sqlSnakeModal.classList.remove('active');
        }
    }

    sqlSnakeBtn?.addEventListener('click', openSqlSnakeModal);
    mobileSqlSnakeBtn?.addEventListener('click', openSqlSnakeModal);
    closeSqlSnakeModal?.addEventListener('click', closeSqlSnakeModalFunc);
});

// Game Constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Game State
let snake = [{ x: 10, y: 10 }];
let food = {};
let score = 0;
let direction = 'right';
let changingDirection = false;
let gameLoop;

// Database symbols for food
const dbSymbols = ['🗃️', '💾', '💿', '📀', '📄', '📊', '📈', '📉'];

// Initialize Game
function initializeGame() {
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    changingDirection = false;
    generateFood();
    if (gameLoop) clearInterval(gameLoop);

    const countdownElement = document.getElementById('countdown');
    let count = 3;
    countdownElement.style.display = 'flex';
    countdownElement.textContent = count;

    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownElement.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdownElement.style.display = 'none';
            gameLoop = setInterval(main, 100);
        }
    }, 1000);
}

// Main game loop
function main() {
    if (isGamePaused()) return;
    changingDirection = false;
    clearCanvas();
    moveSnake();
    drawFood();
    drawSnake();
    checkCollision();
}

// Game logic functions
function clearCanvas() {
    ctx.fillStyle = '#121212'; // var(--background)
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = '#00BFFF'; // var(--accent)
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });
}

function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };
    switch (direction) {
        case 'up': head.y -= 1; break;
        case 'down': head.y += 1; break;
        case 'left': head.x -= 1; break;
        case 'right': head.x += 1; break;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
        symbol: dbSymbols[Math.floor(Math.random() * dbSymbols.length)]
    };
    if (snake.some(part => part.x === food.x && part.y === food.y)) {
        generateFood();
    }
}

function drawFood() {
    ctx.font = `${gridSize}px Arial`;
    ctx.fillText(food.symbol, food.x * gridSize, food.y * gridSize + gridSize);
}

function checkCollision() {
    const head = snake[0];
    if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount ||
        snake.slice(1).some(part => part.x === head.x && part.y === head.y)
    ) {
        clearInterval(gameLoop);
        alert(`Game Over! Your score: ${score}`);
    }
}

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;
    const keyPressed = event.key;
    const goingUp = direction === 'up';
    const goingDown = direction === 'down';
    const goingLeft = direction === 'left';
    const goingRight = direction === 'right';

    if (keyPressed === 'ArrowUp' && !goingDown) direction = 'up';
    if (keyPressed === 'ArrowDown' && !goingUp) direction = 'down';
    if (keyPressed === 'ArrowLeft' && !goingRight) direction = 'left';
    if (keyPressed === 'ArrowRight' && !goingLeft) direction = 'right';
}

function isGamePaused() {
    const modal = document.getElementById('sqlSnakeModal');
    return !modal.classList.contains('active');
}

// Event Listeners
document.addEventListener('keydown', changeDirection);
sqlSnakeBtn?.addEventListener('click', initializeGame);
mobileSqlSnakeBtn?.addEventListener('click', initializeGame);

// Swipe controls for mobile
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

canvas.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
}, false);

canvas.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;
    handleSwipe();
}, false);

function handleSwipe() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 50) { // Threshold for swipe
        const goingUp = direction === 'up';
        const goingDown = direction === 'down';
        const goingLeft = direction === 'left';
        const goingRight = direction === 'right';

        if (absDx > absDy) {
            if (dx > 0 && !goingLeft) {
                direction = 'right';
            } else if (!goingRight) {
                direction = 'left';
            }
        } else {
            if (dy > 0 && !goingUp) {
                direction = 'down';
            } else if (!goingDown) {
                direction = 'up';
            }
        }
    }
}