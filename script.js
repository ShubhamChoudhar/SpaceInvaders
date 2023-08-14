// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 30,
    speed: 5,
    bullets: []
};

const invaders = [];
const invadersRowCount = 5;
const invadersColumnCount = 10;
const invaderWidth = 40;
const invaderHeight = 30;
const invaderPadding = 10;
const invaderOffsetTop = 30;
const invaderOffsetLeft = 30;
let direction = 1; // 1 for right, -1 for left
const invaderMoveSpeed = 5;
const invaderDropDistance = 30;

for(let c=0; c<invadersColumnCount; c++) {
    invaders[c] = [];
    for(let r=0; r<invadersRowCount; r++) {
        invaders[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawPlayer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function setupInvaders() {
    for(let c=0; c<invadersColumnCount; c++) {
        for(let r=0; r<invadersRowCount; r++) {
            invaders[c][r].x = (c * (invaderWidth + invaderPadding)) + invaderOffsetLeft;
            invaders[c][r].y = (r * (invaderHeight + invaderPadding)) + invaderOffsetTop;
        }
    }
}

function drawInvaders() {
    for(let c=0; c<invadersColumnCount; c++) {
        for(let r=0; r<invadersRowCount; r++) {
            if(invaders[c][r].status == 1) {
                ctx.fillStyle = 'green';
                ctx.fillRect(invaders[c][r].x, invaders[c][r].y, invaderWidth, invaderHeight);
            }
        }
    }
}

function drawBullets() {
    ctx.fillStyle = 'red';
    for(let i = 0; i < player.bullets.length; i++) {
        const bullet = player.bullets[i];
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function updateGameArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawInvaders();
    drawBullets();

    requestAnimationFrame(updateGameArea);
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft': // Left Arrow
            player.x -= player.speed;
            break;
        case 'ArrowRight': // Right Arrow
            player.x += player.speed;
            break;
        case ' ': // Spacebar
            player.bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, speed: 5 });
            break;
    }
});

function moveBullets() {
    for(let i = 0; i < player.bullets.length; i++) {
        const bullet = player.bullets[i];  // Define the current bullet
        bullet.y -= bullet.speed;

        // Check for collisions with invaders
        for(let c=0; c<invadersColumnCount; c++) {
            for(let r=0; r<invadersRowCount; r++) {
                const invader = invaders[c][r];
                if(bullet.x > invader.x && bullet.x < invader.x + invaderWidth && bullet.y > invader.y && bullet.y < invader.y + invaderHeight && invader.status == 1) {
                    invader.status = 0;
                    player.bullets.splice(i, 1);
                }
            }
        }
    }
    // Remove bullets that are out of the canvas
    player.bullets = player.bullets.filter(bullet => bullet.y > 0);

}

function bulletCollision() {
    for(let i = 0; i < player.bullets.length; i++) {
        const bullet = player.bullets[i];
        for(let c=0; c<invadersColumnCount; c++) {
            for(let r=0; r<invadersRowCount; r++) {
                const invader = invaders[c][r];
                if(bullet.x > invader.x && bullet.x < invader.x + invaderWidth && bullet.y > invader.y && bullet.y < invader.y + invaderHeight && invader.status == 1) {
                    invader.status = 0;
                    player.bullets.splice(i, 1);
                }
            }
        }
    }
}

function moveInvaders() {
    let hitEdge = false;
    console.log(invaders[0][0].x);

    for(let c=0; c<invadersColumnCount; c++) {
        for(let r=0; r<invadersRowCount; r++) {
            if(invaders[c][r].status == 1) {
                if(invaders[c][r].x + direction * invaderMoveSpeed + invaderWidth > canvas.width || invaders[c][r].x + direction * invaderMoveSpeed < 0) {
                    hitEdge = true;
                }
            }
        }
    }

    if(hitEdge) {
        direction = -direction;
        for(let c=0; c<invadersColumnCount; c++) {
            for(let r=0; r<invadersRowCount; r++) {
                invaders[c][r].y += invaderDropDistance;
            }
        }
    } else {
        for(let c=0; c<invadersColumnCount; c++) {
            for(let r=0; r<invadersRowCount; r++) {
                if(invaders[c][r].status == 1) {
                    invaders[c][r].x += direction * invaderMoveSpeed;
                }
            }
        }
    }

}

function removeOutOfBoundBullets() {
    for(let i = 0; i < player.bullets.length; i++) {
        if(player.bullets[i].y <= 0) {
            player.bullets.splice(i, 1);
        }
    }
}

function isGameOver() {
    for(let c=0; c<invadersColumnCount; c++) {
        for(let r=0; r<invadersRowCount; r++) {
            if(invaders[c][r].status == 1 && invaders[c][r].y + invaderHeight > player.y) {
                return true;
            }
        }
    }
    return false;
}

function isVictory() {
    for(let c=0; c<invadersColumnCount; c++) {
        for(let r=0; r<invadersRowCount; r++) {
            if(invaders[c][r].status == 1) {
                return false;
            }
        }
    }
    return true;
}

function gameLoop() {
    if(isGameOver()) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '30px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    if(isVictory()) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '30px Arial';
        ctx.fillStyle = 'green';
        ctx.fillText('Victory!', canvas.width / 2 - 70, canvas.height / 2);
        return;
    }

    moveInvaders();
    moveBullets();
    bulletCollision();
    removeOutOfBoundBullets();
    updateGameArea();

    requestAnimationFrame(gameLoop);
}

setupInvaders();
gameLoop();