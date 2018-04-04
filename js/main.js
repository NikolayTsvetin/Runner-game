window.addEventListener('load', () => {
    'use strict';

    const WIDTH = 968;
    const HEIGHT = WIDTH / 2;
    let counter = 0;
    const score = document.getElementById('score');
    const gameOver = document.getElementById('game-over');
    let levelCounter = 1;
    const level = document.getElementById('level');

    const playerCanvas = document.getElementById('player-canvas');
    const playerContext = playerCanvas.getContext('2d');
    const playerImg = document.getElementById('character-sprite');

    playerCanvas.width = WIDTH;
    playerCanvas.height = HEIGHT;

    // try with ball as a character
    const characterSprite = createSprite({
        spritesheet: playerImg,
        context: playerContext,
        width: playerImg.width / 8,
        height: playerImg.height,
        numberOfFrames: 8,
        loopTicksPerFrame: 5
    });

    const characterBody = createPhysicalBody({
        defaultAcceleration: { x: 5, y: 15 },
        coordinates: { x: 0, y: (HEIGHT - characterSprite.height) },
        speed: { x: 0, y: 0 },
        height: characterSprite.height,
        width: characterSprite.width
    });

    function applyGravityVertical(physicalBody, gravity) {

        if (physicalBody.coordinates.y === HEIGHT - physicalBody.height) {
            return;
        }

        if (physicalBody.coordinates.y >= HEIGHT - physicalBody.height) {
            physicalBody.coordinates.y = HEIGHT - physicalBody.height;
            physicalBody.speed.y = 0;

            return;
        }

        physicalBody.speed.y += gravity;
    }

    function dontEscapeTheMap(physicalBody) {
        if (physicalBody.coordinates.x === WIDTH - physicalBody.width) {
            return;
        }

        if (physicalBody.coordinates.x > WIDTH - physicalBody.width) {
            physicalBody.coordinates.x = WIDTH - physicalBody.width - 1;

            return;
        }

        if (physicalBody.coordinates.x === 0 + physicalBody.width) {
            return;
        }

        if (physicalBody.coordinates.x <= 0) {
            physicalBody.coordinates.x = 1;

            return;
        }
    }

    window.addEventListener('keydown', (e) => {
        switch (e.keyCode) {
            case 65:
            case 37:
                if (characterBody.speed.x < 0) {
                    return;
                }

                characterBody.accelerate('x', -1);
                break;
            case 87:
            case 38:
                // jumping
                if (characterBody.coordinates.y < (HEIGHT - characterBody.height)) {
                    return;
                }

                characterBody.accelerate('y', -1);
                break;
            case 68:
            case 39:
                if (characterBody.speed.x > 0) {
                    return;
                }

                characterBody.accelerate('x', 1);
                break;
            case 40:
                // if flying or whatever - dont need it now
                break;
            default:
                break;
        }
    });

    window.addEventListener('keyup', (e) => {
        // check for the right keyup
        if (e.keyCode !== 37 && e.keyCode !== 39 &&
            e.keyCode !== 68 && e.keyCode !== 65) {
            return;
        }
        characterBody.speed.x = 0;
    });

    const tripCanvas = document.getElementById('trip-canvas');
    const tripContext = tripCanvas.getContext('2d');
    const tripImg = document.getElementById('trip');

    tripCanvas.width = WIDTH;
    tripCanvas.height = HEIGHT;

    function createTrip(offsetX) {
        const tripSprite = createSprite({
            spritesheet: tripImg,
            context: tripContext,
            width: tripImg.width / 36,
            height: tripImg.height / 18,
            numberOfFrames: 36,
            loopTicksPerFrame: 5
        });

        const tripBody = createPhysicalBody({
            coordinates: { x: offsetX, y: (HEIGHT - tripSprite.height) },
            speed: { x: -7, y: 0 },
            width: tripSprite.width,
            height: tripSprite.height
        });

        return {
            sprite: tripSprite,
            body: tripBody
        };
    }

    const trips = [];

    function spawnTrip() {
        const spawnOffsetX = 120;
        const spawnChance = 0.02;

        if (Math.random() < spawnChance) {
            if (trips.length) {
                const lastTrip = trips[trips.length - 1];
                const starting = Math.max(lastTrip.body.coordinates.x +
                    lastTrip.body.width + spawnOffsetX, WIDTH);
                const newTrip = createTrip(starting);

                trips.push(newTrip);
                // wtf
            } else {
                trips.push(createTrip(WIDTH));
            }
        }
    }

    const background = createBackground({
        width: WIDTH,
        height: HEIGHT,
        speedX: 5
    });

    function gameLoop() {
        applyGravityVertical(characterBody, 0.6);
        dontEscapeTheMap(characterBody);

        const lastCharacterCoordinates = characterBody.move();

        characterSprite
            .render(characterBody.coordinates, lastCharacterCoordinates);
        characterSprite.update();

        for (let i = 0; i < trips.length; i += 1) {
            const trip = trips[i];

            if (counter < 25) {
                level.innerText = 'Level: ' + levelCounter;
            }
            if (counter >= 25) {
                levelCounter = 2;
                level.innerText = 'Level: ' + levelCounter;
                background.speedX = 4;
            }
            if (counter >= 35) {
                levelCounter = 3;
                level.innerText = 'Level: ' + levelCounter;
                background.speedX = 3;
            }
            if (counter >= 50) {
                levelCounter = 4;
                level.innerText = 'Level: ' + levelCounter;
                background.speedX = 2;
            }
            if (counter >= 65) {
                levelCounter = 5;
                level.innerText = 'Level: ' + levelCounter;
                background.speedX = 1;
            }
            if (counter >= 85) {
                levelCounter = 6;
                level.innerText = 'Level: ' + levelCounter;
                background.speedX = -1;
            }
            if (counter >= 100) {
                levelCounter = 7;
                level.innerText = 'Level: ' + levelCounter;
                background.speedX = -2;
            }
            if (counter >= 125) {
                levelCounter = 8;
                level.innerText = 'Level: ' + levelCounter;
                background.speedX = -3;
            }
            if (counter >= 140) {
                levelCounter = 9;
                level.innerText = 'Level: ' + levelCounter;
                background.speedX = -5;
            }

            if (trip.body.coordinates.x < -trip.body.width) {
                trips.splice(i, 1);
                i -= 1;
                counter += 1;
                score.innerText = 'Score: ' + counter;
                continue;
                // not really sure - maybe without continue its the same
            }

            const lastTripCoordinates = trip.body.move();

            trip.sprite.render(trip.body.coordinates, lastTripCoordinates);
            trip.sprite.update();

            if (characterBody.collidesWith(trip.body)) {
                const endingSong = document.getElementById('audio');

                endingSong.play();

                setTimeout(() => {
                    gameOver.style.position = 'absolute';
                    gameOver.style.display = 'block';
                    score.style.zIndex = 25;
                    level.style.zIndex = 25;
                }, 2000);

                return;
            }
        }

        spawnTrip();

        background.render();
        background.update();

        window.requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
