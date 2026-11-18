'use strict';

// Generates the mazes where dragon balls are collected: maps in the Tiled
// format and positions of the balls. Maps 1-3 were made by hand in Tiled;
// this script adds the next ones, every one checked to be passable.
//
// Usage: node scripts/draw-mazes.js

const fs = require('fs');
const path = require('path');

const data = path.resolve(__dirname, '../src/public/assets/data');
const template = require(path.join(data, 'maps/collecting-1.json'));

const FIRST_MAP = 4;
const LAST_MAP = 10;
const WIDTH = 20;
const HEIGHT = 10;
const BALLS = 7;
// Tiles of collect-spritesheet.png: a rock, a bush and grass.
const ROCK = 1;
const BUSH = 3;
const GRASS = 4;
// The player starts here (in tiles).
const START = [0, 1];
// The longest route through all balls (in tiles), so the time limit is fair.
const MAX_ROUTE = 95;

function createRandom(seed) {
    let state = seed;

    return () => {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
}

const key = ([x, y]) => `${x},${y}`;
const NEIGHBORS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function distancesFrom(tiles, from) {
    const distances = new Map([[key(from), 0]]);
    const queue = [from];

    while (queue.length > 0) {
        const [x, y] = queue.shift();

        NEIGHBORS.forEach(([dx, dy]) => {
            const next = [x + dx, y + dy];
            const isFree = next[0] >= 0 && next[1] >= 0 && next[0] < WIDTH && next[1] < HEIGHT && tiles[next[1] * WIDTH + next[0]] === GRASS;

            if (isFree && !distances.has(key(next))) {
                distances.set(key(next), distances.get(key([x, y])) + 1);
                queue.push(next);
            }
        });
    }

    return distances;
}

/**
 * Obstacles in clusters: short random walks of rocks or bushes.
 */
function drawTiles(random) {
    const tiles = new Array(WIDTH * HEIGHT).fill(GRASS);
    const clusters = 22 + Math.floor(random() * 8);

    for (let cluster = 0; cluster < clusters; cluster++) {
        const tile = random() < 0.5 ? ROCK : BUSH;
        let x = Math.floor(random() * WIDTH);
        let y = Math.floor(random() * HEIGHT);
        const length = 2 + Math.floor(random() * 5);

        for (let step = 0; step < length; step++) {
            tiles[y * WIDTH + x] = tile;
            const [dx, dy] = NEIGHBORS[Math.floor(random() * 4)];
            x = Math.min(WIDTH - 1, Math.max(0, x + dx));
            y = Math.min(HEIGHT - 1, Math.max(0, y + dy));
        }
    }

    // A free corner to start from.
    [START, [1, 1], [0, 0], [0, 2]].forEach(([x, y]) => {
        tiles[y * WIDTH + x] = GRASS;
    });

    // Grass which cannot be reached becomes a bush.
    const reachable = distancesFrom(tiles, START);
    tiles.forEach((tile, index) => {
        if (tile === GRASS && !reachable.has(key([index % WIDTH, Math.floor(index / WIDTH)]))) {
            tiles[index] = BUSH;
        }
    });

    return tiles;
}

/**
 * Balls far from the start and from each other.
 */
function placeBalls(tiles, random) {
    const free = [...distancesFrom(tiles, START).keys()].map((value) => value.split(',').map(Number));
    const balls = [];

    for (let attempt = 0; attempt < 2000 && balls.length < BALLS; attempt++) {
        const candidate = free[Math.floor(random() * free.length)];
        const isFar = (other, distance) => Math.abs(other[0] - candidate[0]) + Math.abs(other[1] - candidate[1]) >= distance;

        if (isFar(START, 4) && balls.every((ball) => isFar(ball, 4))) {
            balls.push(candidate);
        }
    }

    return balls;
}

/**
 * Length of a route which always goes to the nearest ball left.
 */
function routeLength(tiles, balls) {
    let position = START;
    let left = balls.slice();
    let length = 0;

    while (left.length > 0) {
        const distances = distancesFrom(tiles, position);
        left.sort((a, b) => distances.get(key(a)) - distances.get(key(b)));
        length += distances.get(key(left[0]));
        position = left.shift();
    }

    return length;
}

for (let map = FIRST_MAP; map <= LAST_MAP; map++) {
    const random = createRandom(map * 7919);

    for (let attempt = 0; ; attempt++) {
        const tiles = drawTiles(random);
        const balls = placeBalls(tiles, random);
        const free = tiles.filter((tile) => tile === GRASS).length;

        if (balls.length < BALLS || free < 110) {
            continue;
        }

        const route = routeLength(tiles, balls);

        if (route > MAX_ROUTE) {
            continue;
        }

        const json = JSON.parse(JSON.stringify(template));
        json.layers[0].data = tiles;

        fs.writeFileSync(path.join(data, `maps/collecting-${map}.json`), JSON.stringify(json));
        fs.writeFileSync(path.join(data, `balls-positions/positions-${map}.json`), JSON.stringify(balls) + '\n');
        console.log(`[draw-mazes] map ${map}: ${free} free tiles, route ${route} tiles, attempts ${attempt + 1}`);
        break;
    }
}
