'use strict';

// Draws the scenery and the other images of the game as pixel art:
// landscapes, backgrounds of the final screens, tiles of the mazes, dragon
// balls, clouds, energy waves, the explosion, bars of health and the logo.
// Like the characters, every image has pixels of 5x5 screen pixels: shapes
// are described on a grid of units, one pixel per unit.
// Requires ImageMagick (`magick`) to write PNG files.
//
// Usage: node scripts/draw-scenery.js

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const pixelart = path.resolve(__dirname, '../src/public/assets/pixelart');

// Every image is enlarged 5 times; one unit of the grid has one pixel.
const SCALE = 5;
const FINE = 1;
const WIDTH = 160;
const HEIGHT = 80;
const TILE = 8;

function hex(value) {
    return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16)).concat(255);
}

/**
 * Repeatable "random" numbers, so the art is the same on every run.
 */
function createRandom(seed) {
    let state = seed;

    return () => {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
}

class Canvas {
    /**
     * @param {number} width In units.
     * @param {number} height In units.
     * @param {number} [fine] Pixels per unit.
     */
    constructor(width, height, fine = FINE) {
        this.width = width;
        this.height = height;
        this.fine = fine;
        this.pixelWidth = Math.round(width * fine);
        this.pixelHeight = Math.round(height * fine);
        this.pixels = new Array(this.pixelWidth * this.pixelHeight).fill([0, 0, 0, 0]);
    }

    /**
     * Paints one pixel, given in pixels.
     */
    paint(x, y, color) {
        if (x >= 0 && y >= 0 && x < this.pixelWidth && y < this.pixelHeight) {
            this.pixels[y * this.pixelWidth + x] = typeof color === 'string' ? hex(color) : color;
        }
    }

    get(x, y) {
        return this.pixels[y * this.pixelWidth + x];
    }

    /**
     * Calls the callback for every pixel with its position in units.
     */
    each(callback) {
        for (let y = 0; y < this.pixelHeight; y++) {
            for (let x = 0; x < this.pixelWidth; x++) {
                callback((x + 0.5) / this.fine, (y + 0.5) / this.fine, x, y);
            }
        }
    }

    /**
     * A small detail: one pixel at a position given in units.
     */
    set(x, y, color) {
        this.paint(Math.floor(x * this.fine), Math.floor(y * this.fine), color);
    }

    rect(x, y, width, height, color) {
        this.each((unitX, unitY, pixelX, pixelY) => {
            if (unitX >= x && unitX < x + width && unitY >= y && unitY < y + height) {
                this.paint(pixelX, pixelY, color);
            }
        });
    }

    ellipse(centerX, centerY, radiusX, radiusY, color) {
        this.each((x, y, pixelX, pixelY) => {
            if (((x - centerX) / radiusX) ** 2 + ((y - centerY) / radiusY) ** 2 <= 1) {
                this.paint(pixelX, pixelY, color);
            }
        });
    }

    polygon(points, color) {
        this.each((x, y, pixelX, pixelY) => {
            let isInside = false;

            for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
                const [ax, ay] = points[i];
                const [bx, by] = points[j];

                if ((ay > y) !== (by > y) && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) {
                    isInside = !isInside;
                }
            }

            if (isInside) {
                this.paint(pixelX, pixelY, color);
            }
        });
    }

    /**
     * A line one pixel thick, between points given in units.
     */
    line(x1, y1, x2, y2, color) {
        const steps = Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * this.fine);

        for (let step = 0; step <= steps; step++) {
            const t = steps === 0 ? 0 : step / steps;
            this.set(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, color);
        }
    }

    /**
     * Horizontal bands of colors with ragged, dithered borders.
     */
    bands(top, bottom, colors, random) {
        const bandHeight = (bottom - top) / colors.length;

        this.each((x, y, pixelX, pixelY) => {
            if (y < top || y >= bottom) {
                return;
            }

            const position = (y - top) / bandHeight;
            const index = Math.min(colors.length - 1, Math.floor(position));
            const isBorder = position - index > 0.82 && index < colors.length - 1;
            const color = isBorder && (pixelX + pixelY) % 2 === 0 && random() > 0.25 ? colors[index + 1] : colors[index];

            this.paint(pixelX, pixelY, color);
        });
    }

    /**
     * Fills everything below a line given by a function of x.
     */
    ridge(bottom, heightAt, color, capColor = null, capSize = 0) {
        this.each((x, y, pixelX, pixelY) => {
            const top = heightAt(x);

            if (y >= top && y < bottom) {
                this.paint(pixelX, pixelY, capColor !== null && y - top < capSize ? capColor : color);
            }
        });
    }

    /**
     * A dark line around everything painted, thick by the given pixels.
     */
    outline(color, thickness = 1) {
        const isPainted = (x, y) => x >= 0 && y >= 0 && x < this.pixelWidth && y < this.pixelHeight && this.get(x, y)[3] > 0;
        const additions = [];

        for (let y = 0; y < this.pixelHeight; y++) {
            for (let x = 0; x < this.pixelWidth; x++) {
                if (isPainted(x, y)) {
                    continue;
                }

                let isNear = false;
                for (let dy = -thickness; dy <= thickness && !isNear; dy++) {
                    for (let dx = -thickness; dx <= thickness && !isNear; dx++) {
                        isNear = isPainted(x + dx, y + dy);
                    }
                }

                if (isNear) {
                    additions.push([x, y]);
                }
            }
        }

        additions.forEach(([x, y]) => this.paint(x, y, color));
    }

    /**
     * The same image turned left to right.
     */
    mirrored() {
        const copy = new Canvas(this.width, this.height, this.fine);

        for (let y = 0; y < this.pixelHeight; y++) {
            for (let x = 0; x < this.pixelWidth; x++) {
                copy.paint(this.pixelWidth - 1 - x, y, this.get(x, y));
            }
        }

        return copy;
    }

    write(file) {
        const raw = Buffer.alloc(this.pixels.length * 4);
        this.pixels.forEach((color, index) => raw.set(color, index * 4));

        const rawFile = path.join(os.tmpdir(), `draw-scenery-${process.pid}.rgba`);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(rawFile, raw);
        execFileSync('magick', [
            '-size', `${this.pixelWidth}x${this.pixelHeight}`, '-depth', '8', `rgba:${rawFile}`,
            '-filter', 'point', '-resize', `${SCALE * 100}%`, '-strip', file
        ]);
        fs.rmSync(rawFile);
        console.log(`[draw-scenery] ${path.relative(pixelart, file)}`);
    }
}

/**
 * A chain of peaks: triangles of different heights next to each other.
 */
function peaks(random, base, minHeight, maxHeight, minWidth, maxWidth) {
    const list = [];
    let x = -10;

    while (x < WIDTH + 10) {
        const width = minWidth + random() * (maxWidth - minWidth);
        list.push({ center: x + width / 2, width, height: minHeight + random() * (maxHeight - minHeight) });
        x += width * 0.6;
    }

    return (column) => base - Math.max(0, ...list.map(({ center, width, height }) => {
        return height * (1 - Math.abs(column - center) / (width / 2));
    }));
}

/**
 * Blades of grass: short vertical strokes of a few pixels.
 */
function tufts(canvas, random, top, bottom, colors, count) {
    for (let index = 0; index < count; index++) {
        const x = Math.floor(random() * canvas.pixelWidth);
        const y = Math.floor((top + random() * (bottom - top)) * canvas.fine);
        const color = colors[Math.floor(random() * colors.length)];
        const height = 1 + Math.floor(random() * 2);

        for (let step = 0; step < height; step++) {
            canvas.paint(x + (step === height - 1 && random() > 0.5 ? 1 : 0), y - step, color);
        }
    }
}

// The horizon of both landscapes; fighters stand lower, on the grass.
const HORIZON = 48;

function drawEarth() {
    const random = createRandom(7);
    const canvas = new Canvas(WIDTH, HEIGHT);

    canvas.bands(0, HORIZON, ['4f7cff', '5f8bff', '709bff', '84adff', '9cc0ff', 'b9d6ff'], random);

    // The sun with a halo.
    canvas.ellipse(128, 13, 9, 9, 'fff3a6');
    canvas.ellipse(128, 13, 7, 7, 'ffe45c');
    canvas.ellipse(126, 11, 3, 3, 'fff6c2');

    canvas.ridge(HORIZON, peaks(random, HORIZON, 12, 26, 26, 44), '7482d8', 'eef2ff', 3);
    canvas.ridge(HORIZON, peaks(random, HORIZON, 6, 14, 22, 36), '5a66b8');
    canvas.ridge(HORIZON, (x) => HORIZON - 4 - 3 * Math.sin(x / 13) - 2 * Math.sin(x / 5 + 1), '3f9a3a');
    canvas.ridge(HORIZON, (x) => HORIZON - 1.5 - 1.5 * Math.sin(x / 9 + 2), '4aa836');

    canvas.bands(HORIZON, HEIGHT, ['5cb531', '63bc36', '6ac33c', '72ca43'], random);
    tufts(canvas, random, HORIZON + 2, HEIGHT, ['4aa028', '86d957'], 110);

    // Flowers.
    for (let index = 0; index < 14; index++) {
        canvas.set(Math.floor(random() * WIDTH), Math.floor(HORIZON + 4 + random() * (HEIGHT - HORIZON - 6)), index % 2 ? 'fff06a' : 'ffffff');
    }

    canvas.write(path.join(pixelart, 'backgrounds/select-player/select-player.png'));
}

function drawNamek() {
    const random = createRandom(21);
    const canvas = new Canvas(WIDTH, HEIGHT);

    canvas.bands(0, HORIZON, ['2fbf78', '3fd08a', '55dd9a', '70e8ab', '8ff2bd', 'b0f9d0'], random);

    // Three suns of Namek.
    canvas.ellipse(30, 12, 6, 6, 'f6ffd0');
    canvas.ellipse(52, 7, 3, 3, 'e8ffb8');
    canvas.ellipse(118, 16, 4, 4, 'f0ffc4');

    // Flat-topped rocks far away and islands of grass.
    canvas.ridge(HORIZON, peaks(random, HORIZON, 8, 18, 14, 22), '3a9a8c', '55b8a6', 2);
    canvas.ridge(HORIZON, (x) => HORIZON - 3 - 3 * Math.sin(x / 17) - 1.5 * Math.sin(x / 6 + 2), '2f8fb3');

    canvas.bands(HORIZON, HEIGHT, ['2b86b8', '3090c2', '369acb', '3da5d4'], random);
    tufts(canvas, random, HORIZON + 2, HEIGHT, ['2478a6', '63c4e8'], 110);

    // Trees of Namek: a thin trunk with a ball of leaves.
    [[14, 9], [41, 6], [67, 11], [96, 7], [123, 10], [147, 6]].forEach(([x, height]) => {
        canvas.rect(x, HORIZON - height, 1, height + 2, '1d5f52');
        canvas.ellipse(x, HORIZON - height - 2, 3.4, 3, '1f9e8f');
        canvas.ellipse(x - 1, HORIZON - height - 3, 1.6, 1.4, '4fd1bf');
    });

    canvas.write(path.join(pixelart, 'backgrounds/namek.png'));
}

function drawGameOver() {
    const random = createRandom(13);
    const canvas = new Canvas(WIDTH, HEIGHT);
    const ground = 60;

    canvas.bands(0, ground, ['050507', '0e0a12', '1c0f18', '2e121a', '45161b', '5e1b1b'], random);

    // Stars and a pale moon.
    for (let index = 0; index < 40; index++) {
        canvas.set(Math.floor(random() * WIDTH), Math.floor(random() * 30), index % 3 ? '6b6b78' : 'c9c9d6');
    }
    canvas.ellipse(30, 16, 8, 8, 'b9b9c4');
    canvas.ellipse(27, 13, 2, 2, '9a9aa8');
    canvas.ellipse(33, 19, 1.5, 1.5, '9a9aa8');

    canvas.ridge(ground, peaks(random, ground, 6, 16, 18, 30), '120d12');
    canvas.bands(ground, HEIGHT, ['1d1a1c', '262224', '2f2a2c'], random);

    // Dead trees.
    [[18, 14], [104, 17], [142, 12]].forEach(([x, height]) => {
        canvas.rect(x, ground - height, 2, height + 2, '0a0808');
        canvas.line(x, ground - height + 4, x - 5, ground - height - 1, '0a0808');
        canvas.line(x + 1, ground - height + 7, x + 6, ground - height + 2, '0a0808');
    });

    // Cracks in the ground.
    for (let index = 0; index < 12; index++) {
        let x = Math.floor(random() * canvas.pixelWidth);
        for (let y = (ground + 2) * FINE; y < canvas.pixelHeight; y++) {
            if (random() > 0.25) {
                canvas.paint(x, Math.round(y), '0c0a0b');
            }
            x += random() > 0.5 ? 1 : -1;
        }
    }

    canvas.write(path.join(pixelart, 'backgrounds/game-over/game-over.png'));
}

function drawWin() {
    const canvas = new Canvas(WIDTH, HEIGHT);
    const center = { x: 80, y: 62 };
    const rays = 24;

    // Rays of light going from behind the horizon.
    canvas.each((x, y, pixelX, pixelY) => {
        const angle = Math.atan2(y - center.y, x - center.x);
        const ray = Math.floor(((angle + Math.PI) / (2 * Math.PI)) * rays);
        canvas.paint(pixelX, pixelY, ray % 2 ? '2f7bff' : '5a9bff');
    });

    canvas.ellipse(center.x, center.y, 16, 16, 'ffe45c');
    canvas.ellipse(center.x, center.y, 12, 12, 'fff3a6');
    canvas.rect(0, 62, WIDTH, HEIGHT - 62, '4aa836');
    canvas.rect(0, 62, WIDTH, 1, '86d957');
    canvas.bands(64, HEIGHT, ['5cb531', '63bc36', '6ac33c'], createRandom(3));

    // Seven dragon balls lying on the grass.
    for (let index = 0; index < 7; index++) {
        const x = 38 + index * 14;
        canvas.ellipse(x, 71, 4, 4, '8a3a06');
        canvas.ellipse(x, 71, 3.5, 3.5, 'f08a1c');
        canvas.ellipse(x - 1, 70, 2, 2, 'ffb347');
        canvas.ellipse(x + 0.3, 71.3, 1, 1, 'd01818');
    }

    canvas.write(path.join(pixelart, 'backgrounds/win/win.png'));
}

function drawCredits() {
    const random = createRandom(5);
    const canvas = new Canvas(WIDTH, HEIGHT);
    // The cast stands on this line.
    const ground = 64;

    canvas.bands(0, ground, ['ffe45c', 'ffd24d', 'ffbd45', 'ffa544', 'ff8a4a', 'f76f55'], random);

    // The setting sun.
    canvas.ellipse(80, ground, 20, 20, 'fff3a6');
    canvas.ellipse(80, ground, 16, 16, 'fffbe0');

    canvas.ridge(ground, peaks(random, ground, 5, 12, 20, 34), 'c9553d');
    canvas.bands(ground, HEIGHT, ['8a3b2a', '7a3224', '6b2a1f'], random);
    tufts(canvas, random, ground + 1, HEIGHT, ['a34a33', '5a2219'], 60);

    canvas.write(path.join(pixelart, 'backgrounds/credits/credits.png'));
}

/**
 * A rocky wasteland, where Cell held his tournament.
 */
function drawWasteland() {
    const random = createRandom(31);
    const canvas = new Canvas(WIDTH, HEIGHT);

    canvas.bands(0, HORIZON, ['5aa0e6', '6eb0ee', '86c0f4', 'a3d2f8', 'c2e3fb', 'e0f1fd'], random);
    canvas.ellipse(34, 12, 6, 6, 'fff6c2');

    // Mesas: flat-topped rocks.
    [[8, 30, 20], [46, 22, 13], [78, 34, 24], [122, 26, 16], [150, 18, 22]].forEach(([x, width, height]) => {
        canvas.rect(x, HORIZON - height, width, height, 'b0714a');
        canvas.rect(x, HORIZON - height, width, 2, 'd49567');
        canvas.rect(x + width - 4, HORIZON - height + 2, 4, height - 2, '8f5636');
    });

    canvas.bands(HORIZON, HEIGHT, ['d9b07a', 'd2a870', 'caa068', 'c29860'], random);
    tufts(canvas, random, HORIZON + 2, HEIGHT, ['b0875a', 'e6c695'], 90);

    // Stones lying around.
    for (let index = 0; index < 10; index++) {
        const x = Math.floor(random() * WIDTH);
        const y = Math.floor(HORIZON + 4 + random() * (HEIGHT - HORIZON - 8));
        canvas.ellipse(x, y, 2, 1.2, '8f6a48');
        canvas.set(x - 1, y - 1, 'c9a377');
    }

    canvas.write(path.join(pixelart, 'backgrounds/wasteland.png'));
}

/**
 * A city at dusk, which Bubu came to destroy.
 */
function drawCity() {
    const random = createRandom(43);
    const canvas = new Canvas(WIDTH, HEIGHT);

    canvas.bands(0, HORIZON, ['3b2a6b', '5a3a86', '86499a', 'b85c9c', 'e07a8f', 'f6a58a'], random);
    canvas.ellipse(118, HORIZON - 4, 8, 8, 'ffd9a0');

    // The skyline: towers with lit windows.
    let x = 0;
    while (x < WIDTH) {
        const width = 6 + Math.floor(random() * 9);
        const height = 8 + Math.floor(random() * 22);

        canvas.rect(x, HORIZON - height, width, height, '2a1f47');

        for (let windowY = HORIZON - height + 2; windowY < HORIZON - 2; windowY += 3) {
            for (let windowX = x + 1; windowX < x + width - 1; windowX += 2) {
                if (random() > 0.55) {
                    canvas.rect(windowX, windowY, 0.9, 1.6, 'ffe27a');
                }
            }
        }

        x += width + 1;
    }

    canvas.bands(HORIZON, HEIGHT, ['4a4763', '53506d', '5c5977', '656281'], random);

    // Lines on the street.
    for (let lineX = 4; lineX < WIDTH; lineX += 16) {
        canvas.rect(lineX, 63, 8, 1, 'd9d6ea');
    }

    canvas.write(path.join(pixelart, 'backgrounds/city.png'));
}

/**
 * The planet of Beerus: a violet sky and a huge tree over a lake.
 */
function drawBeerusPlanet() {
    const random = createRandom(57);
    const canvas = new Canvas(WIDTH, HEIGHT);

    canvas.bands(0, HORIZON, ['1b1445', '2a1d63', '3f2a82', '5a3a9c', '7a52b3', '9c72c9'], random);

    for (let index = 0; index < 45; index++) {
        canvas.set(Math.floor(random() * WIDTH), Math.floor(random() * 26), index % 3 ? 'b9a8e6' : 'ffffff');
    }

    // A ringed planet in the sky.
    canvas.ellipse(126, 14, 7, 7, 'e6a15a');
    canvas.ellipse(124, 12, 3, 3, 'f6c98a');
    canvas.line(114, 13.5, 138, 16.5, 'fff0c2');

    // The tree: a thick trunk with a wide crown.
    canvas.rect(26, HORIZON - 30, 8, 30, '3a2a55');
    canvas.rect(32, HORIZON - 30, 2, 30, '2a1d40');
    canvas.ellipse(30, HORIZON - 34, 20, 10, '2f6f6a');
    canvas.ellipse(24, HORIZON - 38, 10, 5, '4fa39a');
    canvas.ellipse(44, HORIZON - 30, 8, 4, '255650');

    // A lake behind a low shore.
    canvas.rect(0, HORIZON - 3, WIDTH, 3, '5fd0d8');
    canvas.ridge(HORIZON, (column) => HORIZON - 1 - 1.5 * Math.sin(column / 11), '4b3a7a');

    canvas.bands(HORIZON, HEIGHT, ['5a4a8f', '63529a', '6c5aa5', '7663b0'], random);
    tufts(canvas, random, HORIZON + 2, HEIGHT, ['483a78', '9a86d6'], 100);

    canvas.write(path.join(pixelart, 'backgrounds/beerus.png'));
}

/**
 * The ring of the Tournament of Power, floating in the void.
 */
function drawTournament() {
    const random = createRandom(71);
    const canvas = new Canvas(WIDTH, HEIGHT);

    canvas.bands(0, HORIZON, ['05030f', '0b0720', '140c33', '1f1247', '2b185a', '381f6e'], random);

    for (let index = 0; index < 90; index++) {
        const color = ['ffffff', 'b9a8e6', '7fd0ff'][index % 3];
        canvas.set(Math.floor(random() * WIDTH), Math.floor(random() * (HORIZON - 4)), color);
    }

    // Stands for the gods, far away.
    [[20, 9], [80, 12], [140, 9]].forEach(([x, radius]) => {
        canvas.ellipse(x, HORIZON - 6, radius, 4, '4b3a7a');
        canvas.ellipse(x, HORIZON - 7, radius - 2, 2, '7a63b0');
    });

    // The ring: stone tiles with a bright edge.
    canvas.rect(0, HORIZON, WIDTH, HEIGHT - HORIZON, '8a8f9c');
    canvas.rect(0, HORIZON, WIDTH, 1, 'e6ebf5');

    const tile = 8 * FINE;

    canvas.each((x, y, pixelX, pixelY) => {
        const top = Math.round((HORIZON + 0.5) * FINE);

        if (pixelY <= top) {
            return;
        }

        const row = Math.floor((pixelY - top) / tile);
        const isJoint = (pixelY - top) % tile === 0 || (pixelX + row * tile * 1.25) % (tile * 2.5) < 1;

        if (isJoint) {
            canvas.paint(pixelX, pixelY, '6a6f7c');
        } else if (random() > 0.95) {
            canvas.paint(pixelX, pixelY, '9da2af');
        }
    });

    canvas.write(path.join(pixelart, 'backgrounds/tournament.png'));
}

/**
 * A boulder which the energy wave hits on the loading screen.
 */
function drawBoulder() {
    const canvas = new Canvas(16, 14);

    canvas.ellipse(7.5, 7.5, 7.6, 6.2, '2b2b33');
    canvas.ellipse(7.5, 7.2, 6.8, 5.4, '6b6f7a');
    canvas.ellipse(6.4, 6, 4.6, 3.4, '8a8f9c');
    canvas.ellipse(5, 4.6, 1.8, 1.2, 'b9bdc8');
    [[10, 9], [11, 8], [9, 10], [4, 10], [12, 6]].forEach(([x, y]) => canvas.ellipse(x, y, 0.6, 0.5, '4a4d57'));

    canvas.write(path.join(pixelart, 'loader/boulder.png'));
}

/**
 * The explosion of the boulder: frames from a flash to smoke.
 */
function drawExplosion() {
    const random = createRandom(97);
    const size = 24;
    const frames = 6;
    const canvas = new Canvas(size * frames, size);
    const center = size / 2 - 0.5;

    for (let frame = 0; frame < frames; frame++) {
        const offset = frame * size;
        const radius = 3 + frame * 1.8;
        const isSmoke = frame >= 4;
        const rings = isSmoke ? ['3a3a44', '5a5a66', '7a7a88'] : ['d01818', 'ff8a1c', 'ffd23a', 'fff8d0'];

        rings.forEach((color, ring) => {
            const ringRadius = radius * (1 - ring / (rings.length + 1));

            canvas.each((x, y, pixelX, pixelY) => {
                if (x < offset || x >= offset + size) {
                    return;
                }

                // Ragged edges, more holes in the smoke.
                const wobble = (random() - 0.5) * (isSmoke ? 2.4 : 1.2);
                const isInside = Math.hypot(x - offset - center, y - center) <= ringRadius + wobble;
                const isHole = isSmoke && random() > 0.72;

                if (isInside && !isHole) {
                    canvas.paint(pixelX, pixelY, color);
                }
            });
        });
    }

    canvas.write(path.join(pixelart, 'loader/explosion.png'));
}

/**
 * Dragon balls: 7x7 pixels, an orange ball with a red star and a glint
 * which goes around it in four frames.
 */
function drawDragonBalls() {
    const size = 7;
    const canvas = new Canvas(size * 2, size * 2, 1);
    const glints = [[1, 1], [4, 1], [4, 4], [1, 4]];
    const ball = [
        '..ooo..',
        '.oOOOo.',
        'oOO*OOo',
        'oO***Oo',
        'oOO*Odo',
        '.oOddo.',
        '..ooo..'
    ];
    const colors = { o: '7a3204', O: 'f28a1e', d: 'd0661a', '*': 'd01818' };

    glints.forEach((glint, frame) => {
        const offsetX = (frame % 2) * size;
        const offsetY = Math.floor(frame / 2) * size;

        ball.forEach((row, y) => [...row].forEach((cell, x) => {
            if (colors[cell]) {
                canvas.paint(offsetX + x, offsetY + y, colors[cell]);
            }
        }));

        canvas.paint(offsetX + glint[0] + 1, offsetY + glint[1] + 1, 'fff6d8');
    });

    canvas.write(path.join(pixelart, 'sheets/ball-spritesheet.png'));
}

/**
 * Dragon balls with their stars, 1 to 7, for the corner of the screen
 * while they are collected: 9x9 pixels, one frame for each ball.
 */
function drawStarBalls() {
    const size = 9;
    const canvas = new Canvas(size * 7, size, 1);
    const ball = [
        '..ooooo..',
        '.oOOOOOo.',
        'oOwOOOOOo',
        'oOOOOOOOo',
        'oOOOOOOdo',
        'oOOOOOOdo',
        'oOOOOOddo',
        '.oOddddo.',
        '..ooooo..'
    ];
    const colors = { o: '7a3204', O: 'f28a1e', d: 'd0661a', w: 'fff6d8' };
    // Stars as on the real balls: up to six around the middle and one in it.
    const stars = [
        [[4, 4]],
        [[3, 3], [5, 5]],
        [[4, 2], [3, 5], [5, 5]],
        [[3, 3], [5, 3], [3, 5], [5, 5]],
        [[3, 3], [5, 3], [4, 4], [3, 5], [5, 5]],
        [[4, 2], [2, 3], [6, 3], [2, 5], [6, 5], [4, 6]],
        [[4, 2], [2, 3], [6, 3], [4, 4], [2, 5], [6, 5], [4, 6]]
    ];

    stars.forEach((positions, frame) => {
        const offsetX = frame * size;

        ball.forEach((row, y) => [...row].forEach((cell, x) => {
            if (colors[cell]) {
                canvas.paint(offsetX + x, y, colors[cell]);
            }
        }));

        positions.forEach(([x, y]) => canvas.paint(offsetX + x, y, 'd01818'));
    });

    canvas.write(path.join(pixelart, 'sheets/star-balls-spritesheet.png'));
}

/**
 * Tiles of the maps where dragon balls are collected, in the order
 * expected by the maps: a rock, grass, a bush, grass.
 */
function drawTiles() {
    const random = createRandom(11);
    const canvas = new Canvas(TILE * 2, TILE * 2);
    const grass = ['5cb531', '63bc36'];

    function drawGrass(offsetX, offsetY) {
        const size = TILE * FINE;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                canvas.paint(offsetX * FINE + x, offsetY * FINE + y, grass[(x + 2 * y) % 7 === 0 ? 1 : 0]);
            }
        }

        for (let index = 0; index < 7; index++) {
            const x = offsetX * FINE + 2 + Math.floor(random() * (size - 4));
            const y = offsetY * FINE + 3 + Math.floor(random() * (size - 4));
            const color = index % 2 ? '4aa028' : '86d957';
            canvas.paint(x, y, color);
            canvas.paint(x, y - 1, color);
        }
    }

    [[0, 0], [TILE, 0], [0, TILE], [TILE, TILE]].forEach(([x, y]) => drawGrass(x, y));

    // A rock: gray, lit from the top left.
    canvas.ellipse(3.5, 3.8, 3.6, 3.4, '4a4f58');
    canvas.ellipse(3.3, 3.4, 3, 2.8, '8a8f98');
    canvas.ellipse(2.6, 2.6, 1.6, 1.3, 'c4c9d1');
    canvas.ellipse(5, 5, 0.8, 0.5, '5f646d');
    canvas.ellipse(4, 6, 0.7, 0.4, '5f646d');

    // A bush: dark leaves with lighter spots and berries.
    canvas.ellipse(3.5, TILE + 3.8, 3.6, 3.4, '1f5a24');
    canvas.ellipse(3.4, TILE + 3.4, 3, 2.8, '2e7d32');
    [[2, 2], [4, 1.5], [5, 3], [2, 5], [4, 4]].forEach(([x, y]) => canvas.ellipse(x, TILE + y, 0.7, 0.6, '57b85a'));
    [[3, 3], [5, 5]].forEach(([x, y]) => canvas.ellipse(x, TILE + y, 0.5, 0.5, 'd01818'));

    canvas.write(path.join(pixelart, 'sheets/collect-spritesheet.png'));
}

/**
 * A white cloud of a few puffs, with a light blue underside.
 */
function drawCloud() {
    const canvas = new Canvas(40, 20);
    const puffs = [[10, 12, 7, 5], [19, 9, 8, 7], [28, 11, 7, 6], [15, 14, 9, 4], [26, 14, 9, 4]];

    puffs.forEach(([x, y, rx, ry]) => canvas.ellipse(x, y, rx, ry, 'c9dcff'));
    puffs.forEach(([x, y, rx, ry]) => canvas.ellipse(x - 0.6, y - 1, rx - 0.8, ry - 1, 'ffffff'));

    canvas.write(path.join(pixelart, 'cloud.png'));
}

/**
 * Kinto-un: the small yellow cloud Son Goku flies on.
 */
function drawKinto() {
    const canvas = new Canvas(24, 10);
    const puffs = [[6, 6, 5, 3.4], [12, 5, 6, 4], [18, 6, 5, 3.4]];

    puffs.forEach(([x, y, rx, ry]) => canvas.ellipse(x, y, rx, ry, 'c99a12'));
    puffs.forEach(([x, y, rx, ry]) => canvas.ellipse(x - 0.4, y - 0.6, rx - 0.7, ry - 0.8, 'ffd83a'));
    canvas.ellipse(10, 3.5, 2.5, 1.2, 'fff2a0');

    canvas.write(path.join(pixelart, 'kinto.png'));
}

/**
 * An energy wave: a bright ball at the hands and a beam to the right.
 */
function drawWave(width, height, file) {
    const canvas = new Canvas(width, height);
    const middle = height / 2;
    const layers = [['2a6fe0', 1], ['7cc4ff', 0.74], ['ffffff', 0.42]];

    layers.forEach(([color, size]) => {
        canvas.ellipse(middle, middle, middle * size + 0.4, middle * size + 0.4, color);
        canvas.rect(middle, middle - (middle * size) * 0.62, width - middle, middle * size * 1.24, color);
    });

    canvas.write(path.join(pixelart, file));
}

/**
 * Bars of health and experience: stepped colors, a light top and a dark
 * bottom, and their copies turned for the rival on the right.
 */
function drawBars() {
    const width = 51;
    const height = 3;
    const bar = (colorAt) => {
        const canvas = new Canvas(width, height, 1);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const base = hex(colorAt(x / (width - 1)));
                const shade = y === 0 ? 1.25 : y === height - 1 ? 0.75 : 1;
                canvas.paint(x, y, base.slice(0, 3).map((channel) => Math.min(255, Math.round(channel * shade))).concat(255));
            }
        }

        return canvas;
    };
    const steps = (colors) => (t) => colors[Math.min(colors.length - 1, Math.floor(t * colors.length))];
    const hp = bar(steps(['c0261c', 'd8401e', 'e86a1e', 'f09a22', 'e8c428', 'b8d030', '78c838', '4cbc3c']));
    const exp = bar(steps(['3a5fd0', '4a73e0', '5a87ee', '6e9cf6', '86b2fb', 'a2c8ff', 'c0dcff', 'e0eeff']));
    const blank = bar(() => '3a3046');

    blank.write(path.join(pixelart, 'bars/blank.png'));
    hp.write(path.join(pixelart, 'bars/hp.png'));
    hp.mirrored().write(path.join(pixelart, 'bars/hp-invert.png'));
    exp.write(path.join(pixelart, 'bars/exp.png'));
    exp.mirrored().write(path.join(pixelart, 'bars/exp-invert.png'));
}

/**
 * A particle of the dragon ball sparkle: one white pixel.
 */
function drawParticle() {
    const canvas = new Canvas(1, 1, 1);
    canvas.paint(0, 0, 'ffffff');
    canvas.write(path.join(pixelart, 'pixel.png'));
}

/**
 * The logo "7B": a red seven and a yellow B, with a thick dark outline.
 */
function drawLogo() {
    // Drawn on a grid of 32 units, 26 pixels across (130 on the screen).
    const canvas = new Canvas(32, 32, 26 / 32);
    const shape = (points, color) => canvas.polygon(points, color);

    shape([[2, 4], [18, 2], [20, 7], [10, 29], [4, 28], [12, 10], [3, 10]], 'e01010');
    shape([[4, 5], [16, 4], [16, 5.5], [4, 6.5]], 'ff5a3c');
    shape([[17, 8], [19, 8], [10, 28], [8, 28]], 'a80a0a');
    shape([[17, 11], [26, 10], [29, 12], [29, 17], [27, 19], [30, 22], [30, 27], [27, 30], [17, 29]], 'f2d000');
    shape([[18, 12], [25, 11], [25, 12.5], [18, 13.5]], 'fff06a');
    shape([[18, 28], [27, 29], [29, 27], [29, 26], [26, 28], [18, 27]], 'c9a400');
    canvas.rect(21, 14, 3, 2.5, [0, 0, 0, 0]);
    canvas.rect(21, 22, 4, 3.5, [0, 0, 0, 0]);
    canvas.outline('1a0d05', 1);

    canvas.write(path.join(pixelart, 'logo/logo.png'));
}

drawEarth();
drawNamek();
drawGameOver();
drawWin();
drawCredits();
drawWasteland();
drawCity();
drawBeerusPlanet();
drawTournament();
drawBoulder();
drawExplosion();
drawDragonBalls();
drawStarBalls();
drawTiles();
drawCloud();
drawKinto();
drawWave(100, 14, 'loader/kamehameha.png');
drawWave(140, 8, 'beam.png');
drawBars();
drawParticle();
drawLogo();
