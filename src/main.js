// initialize canvas  
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// images
const jimbob = new Image();
jimbob.src = "/jimbob.png";

const woodSpike = new Image();
woodSpike.src = "/wood_spike.png"

const gameOverScreen = new Image();
gameOverScreen.src = "/game_over.jpg"

//game state
let isJumping = false;
let isFalling = false;
let jumpStartY = 0;
const groundY = canvas.height - 300;
let isGameOver = false;

// game obects
const woodSpikeObj = {
  x: 1600,
  y: canvas.height - 200,
  width: 50,
  height: 100,
}

const playerObj = {
  x: 100,
  y: canvas.height - 300,
  width: 200,
  height: 200
}

// draw funcs
function drawGrass() {
  ctx.beginPath()
  ctx.rect(0, canvas.height - 100, canvas.width, 100);
  ctx.fillStyle = 'green';
  ctx.fill();
}

function drawPlayer() {
  ctx.drawImage(
    jimbob,
    playerObj.x,
    playerObj.y,
    playerObj.width,
    playerObj.height
  );
}

function drawWoodSpike() {
  ctx.drawImage(woodSpike, woodSpikeObj.x, woodSpikeObj.y, woodSpikeObj.width, woodSpikeObj.height)
}

function checkCollision() {
  // player hitbox (trimmed)
  const playerPaddingX = 30;
  const playerPaddingTop = 40;
  const playerPaddingBottom = 20;

  const playerLeft = playerObj.x + playerPaddingX;
  const playerRight = playerObj.x + playerObj.width - playerPaddingX;
  const playerTop = playerObj.y + playerPaddingTop;
  const playerBottom = playerObj.y + playerObj.height - playerPaddingBottom;

  // spike hitbox (already trimmed)
  const spikePaddingX = 15;
  const spikePaddingY = 15;

  const spikeLeft = woodSpikeObj.x + spikePaddingX;
  const spikeRight = woodSpikeObj.x + woodSpikeObj.width - spikePaddingX;
  const spikeTop = woodSpikeObj.y + spikePaddingY;
  const spikeBottom = woodSpikeObj.y + woodSpikeObj.height;

  const isColliding =
    playerRight > spikeLeft &&
    playerLeft < spikeRight &&
    playerBottom > spikeTop &&
    playerTop < spikeBottom;

  if (isColliding) {
    isGameOver = true;
  }
}
// update funcs
function updateWoodSpike() {
  woodSpikeObj.x -= 5;
}

function updatePlayer() {
  // jumping up
  if (isJumping) {
    playerObj.y -= 5

    if (jumpStartY - playerObj.y >= 151.1) {
      isJumping = false;
      isFalling = true;
    }
  }

  // falling down
  if (isFalling) {
    playerObj.y += 3.2;

    if (playerObj.y >= groundY) {
      playerObj.y = groundY;
      isFalling = false;
    }
  }
}

// player controls
window.addEventListener("keydown", handleKeydown);

function handleKeydown(e) {
  if (e.key === " ") {
    playerJump()
  }
}

function playerJump() {
  if (isJumping || isFalling) return;
  isJumping = true;
  jumpStartY = playerObj.y;
}





function gameLoop() {
  if (isGameOver) {
    ctx.drawImage(gameOverScreen, 0, 0, canvas.width, canvas.height);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawGrass();
  drawPlayer();
  updatePlayer();
  drawWoodSpike();
  updateWoodSpike();
  checkCollision();
  requestAnimationFrame(gameLoop);
}

gameLoop()
