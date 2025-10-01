const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 12;
const PADDLE_MARGIN = 24;
const PADDLE_SPEED = 7;
const AI_SPEED = 5;
const BALL_SPEED = 6;

// Paddle positions
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;

// Ball position and velocity
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = (Math.random() - 0.5) * BALL_SPEED;

// Scores
let playerScore = 0;
let aiScore = 0;

// Mouse control
canvas.addEventListener('mousemove', (e) => {
    // Calculate mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    // Center paddle on mouse
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp so paddle doesn't go out of bounds
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color, size = "36px") {
    ctx.fillStyle = color;
    ctx.font = `${size} monospace`;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballVelY = (Math.random() - 0.5) * BALL_SPEED;
}

function updateAI() {
    // Simple AI to follow the ball's y position
    const aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (ballY < aiCenter - 10) {
        aiY -= AI_SPEED;
    } else if (ballY > aiCenter + 10) {
        aiY += AI_SPEED;
    }
    // Clamp to bounds
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function updateBall() {
    ballX += ballVelX;
    ballY += ballVelY;

    // Top/bottom wall collision
    if (ballY - BALL_RADIUS < 0) {
        ballY = BALL_RADIUS;
        ballVelY = -ballVelY;
    }
    if (ballY + BALL_RADIUS > canvas.height) {
        ballY = canvas.height - BALL_RADIUS;
        ballVelY = -ballVelY;
    }

    // Left paddle collision
    if (
        ballX - BALL_RADIUS < PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PADDLE_MARGIN + PADDLE_WIDTH + BALL_RADIUS;
        ballVelX = -ballVelX;
        // Add some spin based on where it hits the paddle
        let collidePoint = (ballY - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ballVelY = collidePoint * BALL_SPEED;
    }

    // Right paddle (AI) collision
    if (
        ballX + BALL_RADIUS > canvas.width - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = canvas.width - PADDLE_MARGIN - PADDLE_WIDTH - BALL_RADIUS;
        ballVelX = -ballVelX;
        let collidePoint = (ballY - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ballVelY = collidePoint * BALL_SPEED;
    }

    // Score left/right
    if (ballX - BALL_RADIUS < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + BALL_RADIUS > canvas.width) {
        playerScore++;
        resetBall();
    }
}

function draw() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#222");

    // Middle line
    for (let y = 0; y < canvas.height; y += 32) {
        drawRect(canvas.width / 2 - 2, y, 4, 20, "#555");
    }

    // Draw paddles
    drawRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
    drawRect(canvas.width - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");

    // Draw ball
    drawCircle(ballX, ballY, BALL_RADIUS, "#0ff");

    // Draw scores
    drawText(playerScore, canvas.width / 4, 50, "#fff");
    drawText(aiScore, 3 * canvas.width / 4, 50, "#fff");
}

function gameLoop() {
    updateAI();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
resetBall();
gameLoop();