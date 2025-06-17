const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const quizContainer = document.getElementById('quizContainer');
const quizQuestion = document.getElementById('quizQuestion');

let isGameRunning = false;
let player = { x: 100, y: 200, width: 50, height: 30, speed: 12, lives: 3 };
let obstacles = [];
let boats = [];
let currentLevel = 0;
let score = 0;
let highScore = 0;
let interval = null;
let destinations = [
  { name: "Anne Frank Huis", quiz: "Is het Anne Frank Huis een museum?" },
  { name: "Centraal Station", quiz: "Is Centraal Station het grootste treinstation van Amsterdam?" },
  { name: "Magere Brug", quiz: "Is de Magere Brug een beroemde brug in Amsterdam?" }
];
let currentDestination = null;
let quizStarted = false;

canvas.width = 1100;
canvas.height = 600;

// Afbeeldingen laden
const bgImage1 = new Image();
bgImage1.src = "game.png";

const bgImage2 = new Image();
bgImage2.src = "centraal.png";

const bgImage3 = new Image();
bgImage3.src = "magere.png";

let bgX1 = 0, bgX2 = canvas.width;
const scrollSpeed = 2;

startButton.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp': case 'w': case 'W': player.y -= player.speed; break;
    case 'ArrowDown': case 's': case 'S': player.y += player.speed; break;
    case 'ArrowLeft': case 'a': case 'A': player.x -= player.speed; break;
    case 'ArrowRight': case 'd': case 'D': player.x += player.speed; break;
  }
});

function startGame() {
  isGameRunning = true;
  startButton.style.display = 'none';
  currentLevel = 0;
  player.lives = 3;
  score = 0;
  quizStarted = false;

  isInvincible = true;
  setTimeout(() => { isInvincible = false; }, 2000);

  setTimeout(() => {
    obstacles = createObstacles();
    boats = createBoats();
  }, 1500);

  currentDestination = destinations[currentLevel];
  gameLoop();
}

function goToNextLevel() {
  currentLevel++;
  if (currentLevel < destinations.length) {
    currentDestination = destinations[currentLevel];
    obstacles = [];
    boats = [];
    setTimeout(() => {
      obstacles = createObstacles();
    }, 1500);
    setTimeout(() => {
      boats = createBoats();
    }, 1500);
    resetLevel();
  } else {
    alert("Gefeliciteerd! Je hebt alle levels voltooid!");
    isGameRunning = false;
    startButton.style.display = 'block';
  }
}

function gameLoop() {
  if (isGameRunning) {
    updateBackground();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayer();
    moveObstacles();
    drawObstacles();
    moveBoats();
    drawBoats();
    drawScoreboard();
    checkCollisions();

    if (player.lives > 0 && currentLevel < destinations.length) {
      score++;
      if (score > highScore) {
        highScore = score;
      }
    }

    requestAnimationFrame(gameLoop);
  }
}

function drawScoreboard() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, canvas.width, 40);

  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Level: ${currentDestination ? currentDestination.name : '---'}`, 20, 25);
  ctx.fillText(`Levens: ${player.lives}`, canvas.width - 100, 25);
  ctx.fillText(`Score: ${score}`, canvas.width - 250, 25);
  ctx.fillText(`High Score: ${highScore}`, canvas.width - 450, 25);
}

function updateBackground() {
  bgX1 -= scrollSpeed;
  bgX2 -= scrollSpeed;

  if (bgX1 <= -canvas.width) bgX1 = canvas.width;
  if (bgX2 <= -canvas.width) bgX2 = canvas.width;
}

function drawBackground() {
  let bgImage;
  if (currentLevel === 0) {
    bgImage = bgImage1;
  } else if (currentLevel === 1) {
    bgImage = bgImage2;
  } else if (currentLevel === 2) {
    bgImage = bgImage3;
  } else {
    bgImage = bgImage1; // fallback
  }

  ctx.drawImage(bgImage, bgX1, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, bgX2, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function createObstacles() {
  let obs = [];
  for (let i = 0; i < 5; i++) {
    obs.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 50,
      height: 30,
      speed: Math.random() * 2 + 1
    });
  }
  return obs;
}

function createBoats() {
  let boatsArray = [];
  for (let i = 0; i < 3; i++) {
    boatsArray.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 60,
      height: 30,
      speed: Math.random() * 2 + 1
    });
  }
  return boatsArray;
}

function moveObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.y += obstacle.speed;
    if (obstacle.y > canvas.height) {
      obstacle.y = -obstacle.height;
    }
  });
}

function moveBoats() {
  boats.forEach((boat) => {
    boat.x += boat.speed;
    if (boat.x > canvas.width) {
      boat.x = -boat.width;
    }
  });
}

function drawObstacles() {
  obstacles.forEach((obstacle) => {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    ctx.fillStyle = '#000';
    ctx.fillRect(obstacle.x + obstacle.width / 2 - 2, obstacle.y - 20, 4, 20);

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y - 20);
    ctx.lineTo(obstacle.x + obstacle.width / 2 - 15, obstacle.y + obstacle.height / 2);
    ctx.lineTo(obstacle.x + obstacle.width / 2 + 15, obstacle.y + obstacle.height / 2);
    ctx.closePath();
    ctx.fill();
  });
}

function drawBoats() {
  boats.forEach((boat) => {
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(boat.x, boat.y, boat.width, boat.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(boat.x + boat.width / 2 - 2, boat.y - 20, 4, 20);
  });
}

function checkCollisions() {
  if (player.x < 0 || player.y < 0 || player.y + player.height > canvas.height) handleCollision();

  obstacles.forEach((obstacle) => {
    if (player.x < obstacle.x + obstacle.width && player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height && player.y + player.height > obstacle.y) {
      handleCollision();
    }
  });

  boats.forEach((boat) => {
    if (player.x < boat.x + boat.width && player.x + player.width > boat.x &&
        player.y < boat.y + boat.height && player.y + player.height > boat.y) {
      handleCollision();
    }
  });

  if (player.x + player.width >= canvas.width && !quizStarted) {
    showQuiz();
  }
}

let isInvincible = false;

function handleCollision() {
  if (!isInvincible) {
    player.lives--;
    player.x = 100;
    player.y = 200;
    alert(`Je hebt een leven verloren! Levens over: ${player.lives}`);

    isInvincible = true;
    if (player.lives <= 0) {
      alert("Game Over!");
      isGameRunning = false;
      startButton.style.display = 'block';
    } else {
      setTimeout(() => { isInvincible = false; }, 2000);
    }
  }
}

function showQuiz() {
  quizContainer.style.display = 'block';
  quizQuestion.textContent = currentDestination.quiz;
  quizStarted = true;
}

function checkAnswer(isCorrect) {
  if (isCorrect) {
    alert("Correct! Ga door naar het volgende level.");
    quizContainer.style.display = 'none';
    goToNextLevel();
  } else {
    alert("Fout! Probeer het level opnieuw.");
    quizContainer.style.display = 'none';
    resetLevel();
  }
}

function resetLevel() {
  player.x = 100;
  player.y = 200;
  quizStarted = false;

  isInvincible = true;
  setTimeout(() => { isInvincible = false; }, 2000);

  setTimeout(() => {
    obstacles = createObstacles();
    boats = createBoats();
  }, 1500);
}
