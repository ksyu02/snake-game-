const decor = document.querySelector(".bg-decor");

const flowers = ["🌸", "🌼", "🌷", "✨"];

function spawnFlower() {
    const el = document.createElement("div");
    el.classList.add("flower");

    el.textContent =
        flowers[Math.floor(Math.random() * flowers.length)];

    el.style.left = Math.random() * window.innerWidth + "px";
    el.style.fontSize = 12 + Math.random() * 20 + "px";
    el.style.animationDuration = 6 + Math.random() * 8 + "s";

    decor.appendChild(el);

    setTimeout(() => el.remove(), 12000);
}

setInterval(spawnFlower, 300);

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const gameOverText = document.getElementById("gameOver");

let snake = [];
let food = null;
let goldenFood = null;

let particles = [];

let dx = 10;
let dy = 0;

let score = 0;
let level = 1;

let gameRunning = false;
let paused = false;

let gameSpeed = 100;

let highScore =
    Number(localStorage.getItem("highScore")) || 0;

highScoreElement.textContent = highScore;

/* =========================
   START SCREEN
========================= */

function showStartScreen() {

    ctx.fillStyle = "#111";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "white";

    ctx.font = "bold 34px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "🐍 SNAKE GAME",
        canvas.width / 2,
        canvas.height / 2 - 30
    );

    ctx.font = "18px Arial";

    ctx.fillText(
        "Нажми кнопку",
        canvas.width / 2,
        canvas.height / 2 + 10
    );

    ctx.fillText(
        "НАЧАТЬ ИГРУ",
        canvas.width / 2,
        canvas.height / 2 + 40
    );
}

/* =========================
   START GAME
========================= */

function startGame() {

    snake = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 },
        { x: 170, y: 200 }
    ];

    dx = 10;
    dy = 0;

    score = 0;
    level = 1;

    gameSpeed = 100;

    particles = [];

    goldenFood = null;

    gameRunning = true;
    paused = false;

    scoreElement.textContent = score;

    gameOverText.classList.add("hidden");

    createFood();

    loop();
}

/* =========================
   CLEAR CANVAS
========================= */

function clearCanvas() {

    ctx.fillStyle = "white";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

/* =========================
   PARTICLES
========================= */

function createParticles(
    x,
    y,
    color
) {

    for (let i = 0; i < 15; i++) {

        particles.push({

            x: x,
            y: y,

            vx:
                (Math.random() - 0.5) * 4,

            vy:
                (Math.random() - 0.5) * 4,

            life: 25,

            color: color

        });

    }

}

function drawParticles() {

    particles.forEach((p, index) => {

        p.x += p.vx;
        p.y += p.vy;

        p.life--;

        ctx.fillStyle = p.color;

        ctx.fillRect(
            p.x,
            p.y,
            3,
            3
        );

        if (p.life <= 0) {

            particles.splice(
                index,
                1
            );

        }

    });

}
/* =========================
   FOOD
========================= */

function createFood() {

    food = {

        x:
            Math.floor(
                Math.random() * 40
            ) * 10,

        y:
            Math.floor(
                Math.random() * 40
            ) * 10

    };

}

function createGoldenFood() {

    goldenFood = {

        x:
            Math.floor(
                Math.random() * 40
            ) * 10,

        y:
            Math.floor(
                Math.random() * 40
            ) * 10

    };

    setTimeout(() => {

        goldenFood = null;

    }, 5000);

}

/* =========================
   DRAW FOOD
========================= */

function drawFood() {

    /* -------- КРАСНОЕ ЯБЛОКО -------- */

    if (food) {

        ctx.fillStyle = "red";

        ctx.beginPath();

        ctx.arc(
            food.x + 5,
            food.y + 5,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // блик

        ctx.fillStyle = "#ffcccc";

        ctx.beginPath();

        ctx.arc(
            food.x + 3,
            food.y + 3,
            2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // хвостик

        ctx.strokeStyle = "brown";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            food.x + 5,
            food.y - 2
        );

        ctx.lineTo(
            food.x + 5,
            food.y - 8
        );

        ctx.stroke();

        // листик

        ctx.fillStyle = "green";

        ctx.beginPath();

        ctx.ellipse(
            food.x + 9,
            food.y - 3,
            3,
            2,
            Math.PI / 4,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    /* -------- ЗОЛОТОЕ ЯБЛОКО -------- */

    if (goldenFood) {

        const rainbow = [

            "#ffd700",
            "#ff9800",
            "#ff4081",
            "#9c27b0",
            "#40c4ff",
            "#69f0ae"

        ];

        const color =
            rainbow[
                Math.floor(
                    Date.now() / 150
                ) % rainbow.length
            ];

        // тело

        ctx.fillStyle = color;

        ctx.beginPath();

        ctx.arc(
            goldenFood.x + 5,
            goldenFood.y + 5,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // блик

        ctx.fillStyle = "#fff8c4";

        ctx.beginPath();

        ctx.arc(
            goldenFood.x + 3,
            goldenFood.y + 3,
            2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // хвостик

        ctx.strokeStyle = "#8b5a2b";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            goldenFood.x + 5,
            goldenFood.y - 2
        );

        ctx.lineTo(
            goldenFood.x + 5,
            goldenFood.y - 8
        );

        ctx.stroke();

        // листик

        ctx.fillStyle = "#2ecc71";

        ctx.beginPath();

        ctx.ellipse(
            goldenFood.x + 9,
            goldenFood.y - 3,
            3,
            2,
            Math.PI / 4,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

}
/* =========================
   DRAW SNAKE
========================= */

function drawSnake() {

    const head = snake[0];

    // тело змейки

    snake.forEach((part, index) => {

        const pink = 255;
        const green = 105 + index * 3;
        const blue = 170 + index * 2;

        ctx.fillStyle = `rgb(${pink}, ${green}, ${blue})`;

        ctx.strokeStyle = "#c2185b";

        ctx.fillRect(
            part.x,
            part.y,
            10,
            10
        );

        ctx.strokeRect(
            part.x,
            part.y,
            10,
            10
        );

    });

    // голова ярче

    ctx.fillStyle = "#ff4fa3";

    ctx.fillRect(
        head.x,
        head.y,
        10,
        10
    );

    ctx.strokeStyle = "#880e4f";

    ctx.strokeRect(
        head.x,
        head.y,
        10,
        10
    );

    /* -------- КОРОНА -------- */

    if (score >= 100) {

        ctx.font = "14px Arial";

        ctx.fillText(
            "👑",
            head.x,
            head.y - 5
        );

    }

    /* -------- ГЛАЗКИ -------- */

    ctx.fillStyle = "black";

    ctx.beginPath();

    if (dx === 10) {

        ctx.arc(
            head.x + 7,
            head.y + 3,
            1.5,
            0,
            Math.PI * 2
        );

        ctx.arc(
            head.x + 7,
            head.y + 7,
            1.5,
            0,
            Math.PI * 2
        );

    }

    if (dx === -10) {

        ctx.arc(
            head.x + 3,
            head.y + 3,
            1.5,
            0,
            Math.PI * 2
        );

        ctx.arc(
            head.x + 3,
            head.y + 7,
            1.5,
            0,
            Math.PI * 2
        );

    }

    if (dy === -10) {

        ctx.arc(
            head.x + 3,
            head.y + 3,
            1.5,
            0,
            Math.PI * 2
        );

        ctx.arc(
            head.x + 7,
            head.y + 3,
            1.5,
            0,
            Math.PI * 2
        );

    }

    if (dy === 10) {

        ctx.arc(
            head.x + 3,
            head.y + 7,
            1.5,
            0,
            Math.PI * 2
        );

        ctx.arc(
            head.x + 7,
            head.y + 7,
            1.5,
            0,
            Math.PI * 2
        );

    }

    ctx.fill();

    /* -------- ЯЗЫЧОК -------- */

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    ctx.beginPath();

    if (dx === 10) {

        ctx.moveTo(
            head.x + 10,
            head.y + 5
        );

        ctx.lineTo(
            head.x + 16,
            head.y + 3
        );

        ctx.moveTo(
            head.x + 10,
            head.y + 5
        );

        ctx.lineTo(
            head.x + 16,
            head.y + 7
        );

    }

    if (dx === -10) {

        ctx.moveTo(
            head.x,
            head.y + 5
        );

        ctx.lineTo(
            head.x - 6,
            head.y + 3
        );

        ctx.moveTo(
            head.x,
            head.y + 5
        );

        ctx.lineTo(
            head.x - 6,
            head.y + 7
        );

    }

    if (dy === -10) {

        ctx.moveTo(
            head.x + 5,
            head.y
        );

        ctx.lineTo(
            head.x + 3,
            head.y - 6
        );

        ctx.moveTo(
            head.x + 5,
            head.y
        );

        ctx.lineTo(
            head.x + 7,
            head.y - 6
        );

    }

    if (dy === 10) {

        ctx.moveTo(
            head.x + 5,
            head.y + 10
        );

        ctx.lineTo(
            head.x + 3,
            head.y + 16
        );

        ctx.moveTo(
            head.x + 5,
            head.y + 10
        );

        ctx.lineTo(
            head.x + 7,
            head.y + 16
        );

    }

    ctx.stroke();

    /* -------- LEVEL -------- */

    ctx.fillStyle = "black";

    ctx.font = "18px Arial";

    ctx.fillText(
        "Level: " + level,
        10,
        20
    );

}
/* =========================
   LEVEL SYSTEM
========================= */

function updateLevel() {

    level =
        Math.floor(score / 50) + 1;

    gameSpeed =
        Math.max(
            40,
            100 - (level - 1) * 10
        );

}

/* =========================
   MOVE SNAKE
========================= */

function moveSnake() {

    updateLevel();

    const head = {

        x: snake[0].x + dx,

        y: snake[0].y + dy

    };

    snake.unshift(head);

    const ateFood =

        food &&

        head.x === food.x &&

        head.y === food.y;

    const ateGolden =

        goldenFood &&

        head.x === goldenFood.x &&

        head.y === goldenFood.y;

    /* ---------- ОБЫЧНОЕ ЯБЛОКО ---------- */

    if (ateFood) {

        score += 10;

        scoreElement.textContent =
            score;

        createParticles(
            food.x,
            food.y,
            "red"
        );

        createFood();

    }

    /* ---------- ЗОЛОТОЕ ЯБЛОКО ---------- */

    if (ateGolden) {

        score += 50;

        scoreElement.textContent =
            score;

        createParticles(
            goldenFood.x,
            goldenFood.y,
            "gold"
        );

        goldenFood = null;

    }

    /* ---------- ХВОСТ ---------- */

    if (
        !ateFood &&
        !ateGolden
    ) {

        snake.pop();

    }

    /* ---------- РЕКОРД ---------- */

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "highScore",
            highScore
        );

        highScoreElement.textContent =
            highScore;

    }

}
  /* ---------------- GAME OVER ---------------- */

function gameOver() {

    const head = snake[0];

    const hitWall =
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height;

    const hitSelf = snake
        .slice(1)
        .some(part =>
            part.x === head.x &&
            part.y === head.y
        );

    return hitWall || hitSelf;
}

/* ---------------- START SCREEN ---------------- */

function showStartScreen() {

    clearCanvas();

    ctx.fillStyle = "#222";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "white";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "🐍 SNAKE GAME",
        canvas.width / 2,
        150
    );

    ctx.font = "20px Arial";

    ctx.fillText(
        "Нажми кнопку START",
        canvas.width / 2,
        220
    );

    ctx.fillText(
        "Стрелки = управление",
        canvas.width / 2,
        260
    );

    ctx.fillText(
        "Space = пауза",
        canvas.width / 2,
        290
    );
}

/* ---------------- LOOP ---------------- */

function loop() {

    if (!gameRunning) return;

    if (paused) {

        setTimeout(loop, 100);
        return;

    }

    if (gameOver()) {

        gameRunning = false;

        ctx.fillStyle =
            "rgba(255,0,0,0.75)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle = "white";

        ctx.font =
            "bold 50px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "GAME OVER",
            canvas.width / 2,
            canvas.height / 2
        );

        ctx.font =
            "24px Arial";

        ctx.fillText(
            "Счёт: " + score,
            canvas.width / 2,
            canvas.height / 2 + 50
        );

        return;
    }

    setTimeout(() => {

        clearCanvas();

        moveSnake();

        drawFood();

        drawSnake();

        drawParticles();

        loop();

    }, gameSpeed);
}
/* ---------------- GOLD APPLE SPAWN ---------------- */

setInterval(() => {

    if (
        gameRunning &&
        !goldenFood
    ) {

        createGoldenFood();

    }

}, 15000);

/* ---------------- BUTTONS ---------------- */

startBtn.addEventListener(
    "click",
    startGame
);

restartBtn.addEventListener(
    "click",
    startGame
);

document.addEventListener("keydown", e => {

    if (!gameRunning) return;

    if (e.key === "ArrowLeft" && dx === 0) {
        dx = -10;
        dy = 0;
    }

    if (e.key === "ArrowRight" && dx === 0) {
        dx = 10;
        dy = 0;
    }

    if (e.key === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -10;
    }

    if (e.key === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = 10;
    }

    if (e.code === "Space") {
        paused = !paused;
    }

});

/* ---------------- FIRST SCREEN ---------------- */

showStartScreen();