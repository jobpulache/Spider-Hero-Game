const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const platforms = document.querySelectorAll(".platform");
const scoreBoard = document.getElementById("score");
let score = 0;
let isJumping = false;
let isGameOver = false;

let playerPosition = { x: 50, y: 550, velocityY: 0 };
const gravity = 0.5;

// Move player
document.addEventListener("keydown", (event) => {
    if (isGameOver) return;

    switch (event.key) {
        case "ArrowLeft":
            playerPosition.x -= 10;
            break;
        case "ArrowRight":
            playerPosition.x += 10;
            break;
        case " ":
            if (!isJumping) jump();
            break;
    }
    updatePlayerPosition();
});

function jump() {
    isJumping = true;
    playerPosition.velocityY = -10;
}

function updatePlayerPosition() {
    player.style.left = `${playerPosition.x}px`;
    player.style.bottom = `${playerPosition.y}px`;
}

// Game loop
function gameLoop() {
    if (isGameOver) return;

    // Apply gravity
    playerPosition.velocityY += gravity;
    playerPosition.y -= playerPosition.velocityY;

    // Prevent falling through the floor
    if (playerPosition.y <= 0) {
        playerPosition.y = 0;
        isJumping = false;
    }

    // Check collision with platforms
    platforms.forEach((platform) => {
        const platformRect = platform.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            playerRect.right > platformRect.left &&
            playerRect.left < platformRect.right &&
            playerRect.bottom > platformRect.top &&
            playerRect.bottom < platformRect.top + 10 &&
            playerPosition.velocityY > 0
        ) {
            playerPosition.y = window.innerHeight - platformRect.top - playerRect.height;
            playerPosition.velocityY = 0;
            isJumping = false;
        }
    });

    // Check collision with enemy
    const enemyRect = enemy.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
        playerRect.right > enemyRect.left &&
        playerRect.left < enemyRect.right &&
        playerRect.bottom > enemyRect.top &&
        playerRect.top < enemyRect.bottom
    ) {
        gameOver();
    }

    // Update score
    score++;
    scoreBoard.textContent = score;

    updatePlayerPosition();
    requestAnimationFrame(gameLoop);
}

function gameOver() {
    isGameOver = true;
    alert("Game Over! Final Score: " + score);
    window.location.reload();
}

gameLoop();
