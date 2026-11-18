'use strict';

// Draws all characters of the game as pixel art: fight spritesheets
// and cards. Every character is drawn from a skeleton, so they have
// their own proportions, hair, clothes and details.
//
// Shapes are described on a grid of 30x40 units, one pixel per unit, so
// a frame has 30x40 pixels (enlarged 5 times, to 150x200), like the
// characters drawn by hand in version 1.3.4: a black outline, black lines
// between the parts, a big head with a lot of hair.
// A spritesheet has 3 columns and 10 rows of frames: rows 0-4 look to the
// right, rows 5-9 are the same frames looking to the left. Frames in a row block:
//   0-2 standing, 3-4 punch, 5 jump, 6-7 kick, 8 dodge,
//   9-11 facing the viewer (win), 12-14 hurt.
// The Saiyans get one more spritesheet for each of their forms. Next to
// them: glows (white silhouettes, tinted in the game), a small head for
// the maze, a card and an avatar for the bar of a fight.
// A second spritesheet has white silhouettes of the same frames, a bit
// wider: the glow of a character in a form, tinted in the game.
// Requires ImageMagick (`magick`) to write PNG files.
//
// Usage: node scripts/draw-characters.js

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const pixelart = path.resolve(__dirname, '../src/public/assets/pixelart');
const HEADS = require('./character-heads');

// Every image of the game has pixels of 5x5 screen pixels.
const SCALE = 5;
// Pixels of a frame per unit of the grid.
const FULL_DETAIL = 1;
let DETAIL = FULL_DETAIL;
// Where the grid starts in a frame, in pixels (small frames move it).
let ORIGIN = { x: 0, y: 0 };
let WIDTH = 30;
let HEIGHT = 40;

// Every frame gets a dark outline around the whole character.
let HAS_OUTLINE = true;

const COLUMNS = 3;
const FRAMES = 15;
const GROUND = 39;
const CENTER_X = 14;
const CARD_FRAME = 9;
// How many pixels the glows of a form stick out of a character.
const AURA_GROW = 2;
const BIG_AURA_GROW = 5;

// --- Colors ---

function hex(value) {
    return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16)).concat(255);
}

function mix(color, other, amount) {
    return color.slice(0, 3).map((channel, index) => Math.round(channel + (other[index] - channel) * amount)).concat(255);
}

const BLACK = [0, 0, 0, 255];
const WHITE = [255, 255, 255, 255];
const OUTLINE = hex('000000');

function toHsl([r, g, b]) {
    const [red, green, blue] = [r, g, b].map((channel) => channel / 255);
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;

    if (max === min) {
        return [0, 0, lightness];
    }

    const delta = max - min;
    const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    let hue;

    if (max === red) {
        hue = (green - blue) / delta + (green < blue ? 6 : 0);
    } else if (max === green) {
        hue = (blue - red) / delta + 2;
    } else {
        hue = (red - green) / delta + 4;
    }

    return [hue * 60, saturation, lightness];
}

function fromHsl([hue, saturation, lightness]) {
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const sector = (((hue % 360) + 360) % 360) / 60;
    const second = chroma * (1 - Math.abs((sector % 2) - 1));
    const [r, g, b] = [[chroma, second, 0], [second, chroma, 0], [0, chroma, second], [0, second, chroma], [second, 0, chroma], [chroma, 0, second]][Math.floor(sector) % 6];
    const match = lightness - chroma / 2;

    return [r, g, b].map((channel) => Math.round((channel + match) * 255)).concat(255);
}

/**
 * Turns a hue toward the target by at most the given degrees.
 */
function turnHue(hue, target, degrees) {
    const difference = ((target - hue + 540) % 360) - 180;
    return hue + Math.sign(difference) * Math.min(Math.abs(difference), degrees);
}

// Shadows lean toward cool blue-violet, lights toward warm yellow.
const SHADOW_HUE = 250;
const LIGHT_HUE = 55;

/**
 * A color of a ramp: darker (negative step) or lighter (positive step),
 * with the hue shifted like pixel artists do, instead of mixing black or white.
 */
function shade(color, step) {
    const [hue, saturation, lightness] = toHsl(color);
    const isGray = saturation < 0.08;

    if (step < 0) {
        const amount = -step;
        return fromHsl([
            isGray ? SHADOW_HUE : turnHue(hue, SHADOW_HUE, 9 * amount),
            isGray ? 0.12 * amount : Math.min(1, saturation + 0.03 * amount),
            Math.max(0.04, lightness * (1 - 0.2 * amount))
        ]);
    }

    return fromHsl([
        isGray ? LIGHT_HUE : turnHue(hue, LIGHT_HUE, 10 * step),
        isGray ? 0.15 * step : saturation * (1 - 0.05 * step),
        Math.min(0.96, lightness + (1 - lightness) * 0.3 * step)
    ]);
}

/**
 * A material: a base color with its shadow, light and line colors,
 * a ramp shifted in hue.
 */
function material(value) {
    const base = hex(value);

    return {
        base,
        dark: shade(base, -1),
        light: shade(base, 1),
        // Lines between the parts are black, as in version 1.3.4.
        line: OUTLINE
    };
}

/**
 * The outline next to a color: much darker, and never lighter than
 * a deep shadow, so it separates the character from any background.
 */
function darkOutline(color, step) {
    const line = shade(color, step);
    const [hue, saturation, lightness] = toHsl(line);

    return fromHsl([hue, saturation, Math.min(lightness, 0.2)]);
}

// --- Drawing on a grid of 30x40 pixels ---

class Canvas {
    constructor() {
        this.colors = new Array(WIDTH * HEIGHT).fill(null);
        this.outlines = new Set();
        this.outlineColors = new Set();
    }

    isInside(x, y) {
        return x >= 0 && y >= 0 && x < WIDTH && y < HEIGHT;
    }

    get(x, y) {
        return this.isInside(x, y) ? this.colors[y * WIDTH + x] : null;
    }

    set(x, y, color) {
        if (this.isInside(x, y)) {
            this.colors[y * WIDTH + x] = color;
        }
    }

    /**
     * Paints a shape with a material: lit from the top and the front,
     * with a darker line where it lies over something drawn earlier.
     *
     * @param {Set<number>} mask Indexes of the pixels of the shape.
     * @param {Object} paint A material, or a plain color.
     * @param {Object} [options]
     */
    fill(mask, paint, { shade = true, line = true } = {}) {
        const has = (x, y) => this.isInside(x, y) && mask.has(y * WIDTH + x);
        const changes = [];

        mask.forEach((index) => {
            const x = index % WIDTH;
            const y = Math.floor(index / WIDTH);

            if (!paint.base) {
                changes.push([x, y, paint]);
                return;
            }

            const isOverOther = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
                return !has(x + dx, y + dy) && this.get(x + dx, y + dy) !== null;
            });

            let color = paint.base;

            // A thin highlight at the top, a shadow at the bottom and back;
            // a narrow shape (3 pixels or less across) is lit or dark
            // as a whole band, so it does not break into single pixels.
            let run = 1;
            for (let dx = 1; has(x - dx, y); dx++) {
                run++;
            }
            for (let dx = 1; has(x + dx, y); dx++) {
                run++;
            }
            const isNarrow = run <= 3;

            if (line && isOverOther) {
                color = paint.line;
            } else if (shade && !has(x, y - 1) && !isNarrow) {
                color = paint.light;
            } else if (shade && (!has(x, y + 1) || (!has(x - 1, y) && !isNarrow))) {
                color = paint.dark;
            }

            changes.push([x, y, color]);
        });

        changes.forEach(([x, y, color]) => this.set(x, y, color));
    }

    /**
     * Draws the dark outline around the whole character.
     */
    /**
     * Draws the outline around the whole character: a dark shade of the
     * part it touches (not one black), lighter where the light comes from
     * (the top) and darker at the bottom and back.
     */
    outline() {
        const additions = [];

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                if (this.get(x, y) !== null) {
                    continue;
                }

                // The part below (lit from the top: a softer line) or beside.
                const sides = [[0, 1, -2.2], [1, 0, -2.6], [-1, 0, -2.6], [0, -1, -3]];
                const touching = sides.map(([dx, dy, step]) => [this.get(x + dx, y + dy), step]).find(([color]) => color !== null && !this.isOutline(color));

                if (touching) {
                    additions.push([x, y, OUTLINE]);
                }
            }
        }

        additions.forEach(([x, y, color]) => {
            this.set(x, y, color);
            this.outlines.add(y * WIDTH + x);
        });
    }

    isOutline(color) {
        return this.outlineColors.has(String(color));
    }

    /**
     * Single pixels of a color which differs from all of its neighbors,
     * when three or four of them share a color, take that color: they are
     * noise ("orphan pixels"), not details.
     */
    removeOrphans() {
        const changes = [];

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const color = this.get(x, y);

                if (color === null) {
                    continue;
                }

                const neighbors = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => this.get(x + dx, y + dy));

                if (neighbors.some((other) => other !== null && String(other) === String(color))) {
                    continue;
                }

                const counts = new Map();
                neighbors.filter(Boolean).forEach((other) => counts.set(String(other), (counts.get(String(other)) || 0) + 1));
                const [best, count] = [...counts.entries()].sort((first, second) => second[1] - first[1])[0] || [null, 0];

                if (count >= 3) {
                    changes.push([x, y, neighbors.find((other) => other && String(other) === best)]);
                }
            }
        }

        changes.forEach(([x, y, color]) => this.set(x, y, color));
    }

    /**
     * A white silhouette, wider by the given number of pixels: the base
     * of the glow around a character in a form.
     */
    silhouette(grow) {
        const copy = new Canvas();
        const glow = [255, 255, 255, 255];

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                let isNear = false;

                for (let dy = -grow; dy <= grow && !isNear; dy++) {
                    for (let dx = -grow; dx <= grow && !isNear; dx++) {
                        isNear = Math.abs(dx) + Math.abs(dy) <= grow + 1 && this.get(x + dx, y + dy) !== null;
                    }
                }

                if (isNear) {
                    copy.set(x, y, glow);
                }
            }
        }

        return copy;
    }

    mirrored() {
        const copy = new Canvas();

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                copy.set(WIDTH - 1 - x, y, this.get(x, y));
            }
        }

        return copy;
    }
}

/**
 * Pixels of a shape. The test gets the position of a pixel in units.
 */
function maskOf(test) {
    const mask = new Set();

    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            if (test((x - ORIGIN.x + 0.5) / DETAIL - 0.5, (y - ORIGIN.y + 0.5) / DETAIL - 0.5)) {
                mask.add(y * WIDTH + x);
            }
        }
    }

    return mask;
}

function ellipse(cx, cy, rx, ry) {
    return maskOf((x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1);
}

function distanceToSegment(x, y, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = dx * dx + dy * dy;
    const t = length === 0 ? 0 : Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / length));

    return Math.hypot(x - (a.x + t * dx), y - (a.y + t * dy));
}

/**
 * A thick line: every pixel closer than the radius to the segment.
 */
function capsule(a, b, radius) {
    // Small frames keep limbs at least about two pixels thick.
    const thickness = Math.max(radius, 0.85 / DETAIL);
    return maskOf((x, y) => distanceToSegment(x, y, a, b) <= thickness);
}

/**
 * A thick line through several points.
 */
function chain(points, radius) {
    return maskOf((x, y) => points.slice(1).some((point, index) => distanceToSegment(x, y, points[index], point) <= radius));
}

function polygon(points) {
    return maskOf((x, y) => {
        let isInside = false;

        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const a = points[i];
            const b = points[j];

            if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) {
                isInside = !isInside;
            }
        }

        return isInside;
    });
}

function union(...masks) {
    const result = new Set();
    masks.forEach((mask) => mask.forEach((index) => result.add(index)));
    return result;
}

function minus(mask, other) {
    const result = new Set();
    mask.forEach((index) => {
        if (!other.has(index)) {
            result.add(index);
        }
    });
    return result;
}

/**
 * A small round spot (eyes, marks, details).
 */
function dot(canvas, x, y, rx, color, ry = rx) {
    const mask = ellipse(x, y, rx, ry);

    // A spot smaller than a pixel still gets one pixel.
    if (mask.size === 0) {
        const pixelX = Math.round((x + 0.5) * DETAIL - 0.5) + ORIGIN.x;
        const pixelY = Math.round((y + 0.5) * DETAIL - 0.5) + ORIGIN.y;
        if (pixelX >= 0 && pixelY >= 0 && pixelX < WIDTH && pixelY < HEIGHT) {
            mask.add(pixelY * WIDTH + pixelX);
        }
    }

    canvas.fill(mask, color, { shade: false, line: false });
}

/**
 * A thin line (eyebrows, mouths, scars).
 */
function stroke(canvas, from, to, width, color) {
    const mask = capsule(from, to, width);
    const steps = Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) * DETAIL) + 1;

    // A line thinner than a pixel is still a line of pixels.
    for (let step = 0; step <= steps; step++) {
        const t = step / steps;
        const pixelX = Math.round((from.x + (to.x - from.x) * t + 0.5) * DETAIL - 0.5) + ORIGIN.x;
        const pixelY = Math.round((from.y + (to.y - from.y) * t + 0.5) * DETAIL - 0.5) + ORIGIN.y;
        if (pixelX >= 0 && pixelY >= 0 && pixelX < WIDTH && pixelY < HEIGHT) {
            mask.add(pixelY * WIDTH + pixelX);
        }
    }

    canvas.fill(mask, color, { shade: false, line: false });
}

const point = (x, y) => ({ x, y });
const add = (a, b) => point(a.x + b.x, a.y + b.y);
const toward = (from, degrees, length) => {
    const radians = (degrees * Math.PI) / 180;
    return point(from.x + Math.cos(radians) * length, from.y + Math.sin(radians) * length);
};

// --- Poses ---
// Angles in degrees: 0 points forward (to the right), 90 down, -90 up.
// "lean" tilts the torso forward, "drop" lowers the hips (part of a leg).

const GUARD = { frontUpper: 60, frontFore: -15, backUpper: 75, backFore: -25 };
const STANCE = { frontThigh: 72, frontShin: 100, backThigh: 112, backShin: 92 };

const POSES = [
    { lean: 6, ...STANCE, ...GUARD },
    { lean: 6, drop: 0.06, ...STANCE, ...GUARD },
    { lean: 6, ...STANCE, ...GUARD },
    { lean: 2, ...STANCE, frontUpper: 150, frontFore: -95, backUpper: 100, backFore: -50 },
    { lean: 16, ...STANCE, frontUpper: 0, frontFore: 0, backUpper: 130, backFore: -120 },
    { lean: 4, frontThigh: 15, frontShin: 115, backThigh: 55, backShin: 150, frontUpper: -40, frontFore: -95, backUpper: -120, backFore: -100, isAirborne: true },
    { lean: -4, frontThigh: 5, frontShin: 100, backThigh: 100, backShin: 92, ...GUARD },
    { lean: -18, frontThigh: -12, frontShin: -10, backThigh: 102, backShin: 96, frontUpper: 120, frontFore: 40, backUpper: 140, backFore: -80 },
    { lean: 30, drop: 0.42, frontThigh: 20, frontShin: 112, backThigh: 150, backShin: 95, frontUpper: -20, frontFore: -110, backUpper: -40, backFore: -120 },
    { front: 'rest' },
    { front: 'one' },
    { front: 'both' },
    { lean: -22, frontThigh: 80, frontShin: 95, backThigh: 105, backShin: 92, frontUpper: 115, frontFore: 100, backUpper: 140, backFore: 120, isHurt: true },
    { lean: -26, frontThigh: 80, frontShin: 95, backThigh: 105, backShin: 92, frontUpper: 120, frontFore: 105, backUpper: 145, backFore: 125, isHurt: true },
    { lean: -22, frontThigh: 80, frontShin: 95, backThigh: 105, backShin: 92, frontUpper: 115, frontFore: 100, backUpper: 140, backFore: 120, isHurt: true }
];

// --- Characters ---

const HUMAN_SKIN = 'f0b98a';

/**
 * Builds the description of a character from its differences
 * to an average fighter.
 */
function character(id, settings) {
    return {
        id,
        legs: 13,
        torso: 10,
        head: [4, 4],
        chest: 8,
        hips: 5.6,
        shoulders: 5.6,
        armRadius: 1.05,
        legRadius: 1.3,
        belly: 0,
        hair: null,
        eyes: 'open',
        hasNose: true,
        hasEars: true,
        details: () => null,
        behind: () => null,
        ...settings,
        colors: {
            skin: HUMAN_SKIN,
            eyeWhite: 'ffffff',
            pupil: '20203a',
            hair: '17171f',
            band: '2b4fa8',
            belt: '2b4fa8',
            boots: '2b4fa8',
            ...settings.colors
        }
    };
}

// Hair as polygons around the head, in units of its radius; side view,
// looking to the right. "fringe" is drawn on the forehead seen from the front.
const GOKU_HAIR = {
    shapes: [
        [[-1.15, 0.35], [-1.2, -0.4], [-0.8, -1.0], [-0.1, -1.25], [0.6, -1.05], [1.05, -0.55], [0.9, -0.35], [0.5, -0.45], [0.3, -0.15], [0.0, -0.35], [-0.35, 0.0], [-0.55, 0.55]],
        [[-0.9, -0.75], [-0.5, -1.05], [-2.6, -1.6]],
        [[-1.15, -0.3], [-0.9, -0.8], [-2.9, -0.7]],
        [[-1.2, 0.2], [-1.1, -0.3], [-2.6, 0.5]],
        [[-1.0, 0.35], [-0.7, 0.4], [-1.7, 1.4]],
        [[-0.5, -1.0], [0.1, -1.2], [-0.9, -2.6]],
        [[0.0, -1.2], [0.6, -1.0], [0.8, -2.5]],
        [[0.6, -0.95], [1.05, -0.55], [1.6, -0.15]],
        [[0.3, -0.9], [0.7, -0.6], [0.9, 0.15]]
    ],
    fringe: [[[-0.7, -0.95], [0.7, -0.95], [0.45, -0.2], [0.15, -0.55], [-0.15, -0.2], [-0.45, -0.55], [-0.75, -0.25]]]
};

const VEGETA_HAIR = {
    shapes: [
        [[-1.1, 0.3], [-1.15, -0.5], [-0.6, -1.05], [0.4, -1.1], [0.9, -0.75], [0.75, -0.5], [0.45, -0.75], [0.2, -0.45], [-0.2, -0.6], [-0.55, 0.4]],
        [[-1.1, -0.5], [-0.7, -1.0], [-1.5, -2.5]],
        [[-0.8, -0.9], [-0.2, -1.1], [-0.8, -2.8]],
        [[-0.3, -1.1], [0.3, -1.1], [-0.1, -2.95]],
        [[0.2, -1.05], [0.8, -0.8], [0.7, -2.6]],
        [[-1.15, -0.1], [-1.0, -0.6], [-1.9, -1.6]]
    ],
    fringe: [[[-0.9, -1.0], [0.9, -1.0], [0.6, -0.55], [0, -0.85], [-0.6, -0.55]]]
};

const GOHAN_HAIR = {
    shapes: [
        GOKU_HAIR.shapes[0],
        [[-0.9, -0.75], [-0.5, -1.05], [-1.9, -1.45]],
        [[-1.15, -0.3], [-0.9, -0.8], [-2.1, -0.6]],
        [[-1.2, 0.2], [-1.1, -0.3], [-1.9, 0.4]],
        [[-0.4, -1.0], [0.2, -1.2], [-0.3, -2.0]],
        [[0.4, -0.95], [0.85, -0.75], [0.85, 0.15]]
    ],
    fringe: [[[-0.7, -0.95], [0.7, -0.95], [0.3, -0.5], [0.45, 0.0], [0.1, -0.35], [-0.35, -0.3]]]
};

const TRUNKS_HAIR = {
    shapes: [
        [[-1.2, 0.65], [-1.25, -0.3], [-0.9, -1.0], [0, -1.25], [0.8, -1.05], [1.15, -0.5], [1.1, -0.2], [0.6, -0.45], [0.2, -0.3], [0.15, 0.45], [-0.3, 0.7]],
        [[0.7, -0.6], [1.15, -0.3], [0.95, 0.15]]
    ],
    fringe: [[[-1.0, -0.9], [1.0, -0.9], [0.9, -0.3], [0.25, -0.5], [0.05, -0.15], [-0.6, -0.45], [-1.0, -0.2]]]
};

const YAMCHA_HAIR = {
    shapes: [
        GOKU_HAIR.shapes[0],
        [[-0.9, -0.75], [-0.5, -1.05], [-1.8, -1.3]],
        [[-1.15, -0.3], [-0.9, -0.8], [-2.0, -0.5]],
        [[-1.2, 0.2], [-1.1, -0.3], [-1.8, 0.6]],
        [[0.5, -0.95], [0.95, -0.6], [1.3, -0.1]]
    ],
    fringe: [[[-0.7, -0.95], [0.7, -0.95], [0.6, -0.4], [0.2, -0.6], [-0.2, -0.35], [-0.6, -0.55]]]
};

// A short crest of hair in the middle of a shaved head (C-16).
const MOHAWK = {
    shapes: [[[-0.75, -0.6], [-0.5, -1.0], [-0.45, -1.7], [0.4, -1.75], [0.55, -1.0], [0.65, -0.65], [0.2, -0.85], [-0.3, -0.85]]],
    fringe: [[[-0.3, -1.0], [0.3, -1.0], [0.25, -0.8], [-0.25, -0.8]]]
};

/**
 * Super Saiyan hair: the same shape, with the tips pointing up.
 */
function superSaiyanHair(hair, strength = 1) {
    const lift = (shape) => shape.map(([x, y]) => (Math.hypot(x, y) > 1.35 ? [x * (1 - 0.3 * strength), y - strength] : [x, y]));

    return { shapes: hair.shapes.map(lift), fringe: hair.fringe };
}

/**
 * Super Saiyan 3: a mane falling down to the middle of the back.
 */
function superSaiyan3Hair(hair) {
    const lifted = superSaiyanHair(hair, 0.8);
    const mane = [[-0.9, -0.9], [-1.25, 0.2], [-1.6, 1.6], [-1.35, 2.6], [-1.95, 3.4], [-1.55, 4.3], [-2.1, 5.0], [-0.95, 5.3], [-0.85, 4.1], [-0.55, 3.0], [-0.6, 1.6], [-0.35, 0.5], [-0.2, -0.3]];

    return { shapes: lifted.shapes.concat([mane]), fringe: lifted.fringe };
}

// Forms of the Saiyans: colors, hair, who can use them.
const FORMS = {
    ssj: {
        colors: { hair: 'f7d038', pupil: '1fa391' },
        hair: (hair) => superSaiyanHair(hair),
        ids: ['son-goku', 'vegeta', 'gohan', 'goten', 'trunks']
    },
    ssj2: {
        colors: { hair: 'fbe15c', pupil: '1fa391' },
        hair: (hair) => superSaiyanHair(hair, 1.45),
        ids: ['son-goku', 'vegeta', 'gohan', 'trunks']
    },
    ssj3: {
        colors: { hair: 'f7d038', pupil: '1fa391' },
        hair: superSaiyan3Hair,
        hasNoBrows: true,
        ids: ['son-goku']
    },
    god: {
        colors: { hair: 'd02a44', pupil: 'd02a44' },
        hair: (hair) => hair,
        ids: ['son-goku', 'vegeta']
    },
    blue: {
        colors: { hair: '3fb8ff', pupil: '2a7fd0' },
        hair: (hair) => superSaiyanHair(hair, 0.9),
        ids: ['son-goku', 'vegeta']
    }
};

// Hair of a Saiyan drawn by hand: base, Super Saiyan (also 2 and Blue) and 3.
const saiyanHair = (base, ssj, ssj3 = ssj) => (form) => {
    if (form === FORMS.ssj3) {
        return [ssj3];
    }

    return [form && form !== FORMS.god ? ssj : base];
};

const CHARACTERS = [
    character('son-goku', {
        hair: GOKU_HAIR,
        headLayers: saiyanHair('goku', 'goku-ssj', 'goku-ssj3'),
        colors: { top: 'f07a1c', sleeve: HUMAN_SKIN, pants: 'f07a1c', collar: '2b4fa8' }
    }),
    character('vegeta', {
        headLayers: ['vegeta'],
        legs: 12,
        torso: 9.5,
        head: [3.9, 4],
        hair: VEGETA_HAIR,
        colors: { hair: '3a1a24', top: 'eef0f6', sleeve: '2f3fb0', forearm: '2f3fb0', hand: 'f4f4f8', pants: '2f3fb0', band: 'f4f4f8', belt: '2f3fb0', boots: 'f4f4f8', shoulder: 'f2c94c' }
    }),
    character('gohan', {
        headLayers: saiyanHair('gohan', 'gohan-ssj'),
        hair: GOHAN_HAIR,
        colors: { top: '5b2d8c', sleeve: HUMAN_SKIN, pants: '5b2d8c', band: 'c0392b', belt: 'c0392b', boots: '8b5a2b', collar: '5b2d8c' }
    }),
    character('goten', {
        headLayers: saiyanHair('goku', 'goku-ssj'),
        legs: 8,
        torso: 7,
        head: [4.2, 4.2],
        chest: 5.5,
        hips: 5,
        shoulders: 4,
        armRadius: 0.8,
        legRadius: 1.05,
        hair: GOKU_HAIR,
        colors: { top: 'f07a1c', sleeve: '2b4fa8', forearm: '2b4fa8', pants: 'f07a1c', collar: '2b4fa8' }
    }),
    character('trunks', {
        headLayers: saiyanHair('trunks', 'trunks-ssj'),
        hair: TRUNKS_HAIR,
        colors: { hair: 'b796d6', top: '2b4fa8', sleeve: '2b4fa8', pants: '4a4a55', belt: 'e0b13a', band: '1c1c24', boots: 'c9820f', collar: '1c1c24' }
    }),
    character('piccolo', {
        headLayers: ['turban'],
        legs: 14,
        torso: 11,
        head: [3.9, 4],
        chest: 8,
        shoulders: 6,
        colors: { skin: '5fbf5a', pupil: '20203a', top: '5b2d8c', sleeve: '5fbf5a', pants: '5b2d8c', belt: '3d8bff', band: 'c0392b', boots: '8b5a2b', turban: 'f4f4f8', cape: 'f4f4f8' },
        behind: drawCape,
        details: drawTurban
    }),
    character('krillin', {
        headLayers: ['krillin-dots'],
        legs: 9,
        torso: 8,
        head: [4.4, 4.5],
        chest: 6,
        hips: 5.5,
        shoulders: 4.2,
        armRadius: 0.85,
        legRadius: 1.1,
        hasNose: false,
        colors: { top: 'f07a1c', sleeve: HUMAN_SKIN, pants: 'f07a1c', collar: '2b4fa8' },
        details: drawKrillinDots
    }),
    character('yamcha', {
        headLayers: ['gohan-ssj', 'scar'],
        hair: YAMCHA_HAIR,
        colors: { top: 'f07a1c', sleeve: HUMAN_SKIN, pants: 'f07a1c', collar: '2b4fa8' },
        details: drawScar
    }),
    character('tien', {
        headLayers: ['third-eye'],
        legs: 14,
        torso: 11,
        head: [3.9, 4],
        colors: { top: '2e7d32', sleeve: HUMAN_SKIN, pants: 'e8dcc0', belt: 'c0392b', band: 'c0392b', boots: '2c2c38' },
        details: drawThirdEye
    }),
    character('mr-satan', {
        headLayers: ['afro'],
        torso: 11,
        chest: 8,
        hips: 7,
        shoulders: 6,
        armRadius: 1.1,
        legRadius: 1.35,
        colors: { hair: '2a221c', top: 'f4f4f8', sleeve: HUMAN_SKIN, pants: 'f4f4f8', belt: 'e0b13a', band: 'f4f4f8', boots: '1c1c24', collar: 'e0b13a' },
        behind: drawAfroBack,
        details: drawAfro
    }),
    character('cell', {
        headLayers: ['cell-crest'],
        legs: 14,
        torso: 11,
        head: [3.8, 4],
        chest: 7,
        hasNose: false,
        hasEars: false,
        colors: { skin: 'eae6f2', pupil: 'c0308a', top: '6bbf3a', sleeve: '1f1f28', forearm: '6bbf3a', hand: '1f1f28', pants: '1f1f28', belt: '1f1f28', band: '1f1f28', boots: 'e08a1c', shell: '3f8f2a', cheek: '8e44ad' },
        behind: drawCellWings,
        details: drawCellCrest
    }),
    character('bubu', {
        headLayers: ['bubu-antenna'],
        legs: 8,
        torso: 10,
        head: [4.2, 4.2],
        chest: 9,
        hips: 8,
        shoulders: 7,
        belly: 4.6,
        armRadius: 1.3,
        legRadius: 1.7,
        eyes: 'squint',
        hasEars: false,
        colors: { skin: 'f29bc9', top: '231a2e', sleeve: 'f29bc9', hand: 'f2c94c', pants: 'f4f4f8', belt: '231a2e', band: 'f2c94c', boots: 'f2c94c', cape: '6a2fa0' },
        behind: drawCape,
        details: drawBubuAntenna
    }),
    character('freeza', {
        headLayers: ['freeza-dome'],
        legs: 11,
        torso: 9,
        head: [3.8, 3.9],
        chest: 6,
        hips: 5.5,
        shoulders: 4.5,
        armRadius: 0.85,
        legRadius: 1.15,
        hasEars: false,
        colors: { skin: 'f1f1fa', pupil: 'd01818', top: 'f1f1fa', sleeve: 'f1f1fa', pants: 'f1f1fa', belt: 'f1f1fa', band: 'f1f1fa', boots: 'f1f1fa', dome: '8e44ad', shoulder: '8e44ad' },
        behind: drawTail,
        details: drawFreezaDome
    }),
    character('beerus', {
        headLayers: ['cat-ears'],
        head: [3.9, 3.9],
        chest: 6,
        hips: 6.5,
        shoulders: 4.5,
        armRadius: 0.85,
        hasEars: false,
        colors: { skin: 'a47cc0', eyeWhite: 'f2c94c', pupil: '20203a', top: 'a47cc0', sleeve: 'a47cc0', pants: '1f2a6b', belt: 'f2c94c', band: 'f2c94c', boots: '7a5230', collar: 'f2c94c', ear: 'e89ab8' },
        details: drawCatEars
    }),
    character('c-17', {
        headLayers: ['trunks'],
        hair: TRUNKS_HAIR,
        colors: { top: '1c1c24', sleeve: 'eef0f6', forearm: 'eef0f6', pants: '2b4fa8', belt: '1c1c24', band: 'eef0f6', boots: '3f6b4a', collar: 'f07a1c' }
    }),
    character('c-18', {
        headLayers: ['bob'],
        legs: 12,
        torso: 9.5,
        head: [3.8, 3.9],
        chest: 6.5,
        hips: 6,
        shoulders: 4.6,
        armRadius: 0.85,
        hair: TRUNKS_HAIR,
        colors: { hair: 'f2d16b', top: '3a6fb0', sleeve: '1c1c24', forearm: '1c1c24', pants: '2b4fa8', belt: '7a5230', band: '1c1c24', boots: '7a5230' }
    }),
    character('c-16', {
        headLayers: ['mohawk'],
        legs: 15,
        torso: 12,
        head: [3.9, 4],
        chest: 9,
        hips: 7.5,
        shoulders: 6.5,
        armRadius: 1.2,
        legRadius: 1.5,
        hair: MOHAWK,
        colors: { hair: 'c0392b', top: '4f8f4a', sleeve: '1f2a4a', forearm: '1f2a4a', hand: '1f2a4a', pants: '2a2a3a', belt: '4f8f4a', band: '4f8f4a', boots: 'b88a2a', shoulder: '3e7a3a' }
    }),
    character('cell-jr', {
        headLayers: ['cell-crest'],
        legs: 7,
        torso: 6.5,
        head: [3.6, 3.8],
        chest: 5.5,
        hips: 5,
        shoulders: 4,
        armRadius: 0.8,
        legRadius: 1.05,
        hasNose: false,
        hasEars: false,
        colors: { skin: 'cfe7ff', pupil: 'c0308a', top: '4f9de0', sleeve: '1f2a4a', forearm: '4f9de0', hand: '1f2a4a', pants: '1f2a4a', belt: '1f2a4a', band: '1f2a4a', boots: '2b6fb3', shell: '2b6fb3', cheek: '8e44ad' },
        behind: drawCellWings,
        details: drawCellCrest
    }),
    character('whis', {
        headLayers: ['whis'],
        legs: 13,
        torso: 11,
        head: [3.7, 3.9],
        chest: 6,
        hips: 5.5,
        shoulders: 4.5,
        armRadius: 0.85,
        hasEars: false,
        colors: { skin: 'a3d9e6', pupil: '6a2fa0', hair: 'f4f6fa', top: '7a1f3d', sleeve: '7a1f3d', pants: '7a1f3d', belt: '1b1b22', band: '1b1b22', boots: '1b1b22', ring: '3d8bff' },
        details: drawWhisHair
    })
];


// --- Skeleton ---

function skeleton(char, pose) {
    const legHalf = char.legs / 2;
    const armHalf = (char.torso * 0.95) / 2;
    let hip = point(CENTER_X, GROUND - char.legs * 0.97 + (pose.drop || 0) * char.legs);
    const lean = pose.lean || 0;

    const leg = (offset, thigh, shin) => {
        const top = add(hip, point(offset, 0));
        const knee = toward(top, thigh, legHalf);
        const ankle = toward(knee, shin, legHalf);
        return { top, knee, ankle };
    };

    let front = leg(0.8, pose.frontThigh, pose.frontShin);
    let back = leg(-0.8, pose.backThigh, pose.backShin);

    // Grounded poses stand on the ground, whatever the angles of the legs.
    if (!pose.isAirborne) {
        const lowest = Math.max(front.ankle.y, back.ankle.y) + char.legRadius;
        const shift = GROUND - lowest;
        hip = add(hip, point(0, shift));
        front = leg(0.8, pose.frontThigh, pose.frontShin);
        back = leg(-0.8, pose.backThigh, pose.backShin);
    }

    const shoulder = toward(hip, lean - 90, char.torso);
    const head = add(toward(shoulder, lean - 90, 1 + char.head[1]), point(0.6, 0));

    const arm = (offset, upper, fore) => {
        const top = add(shoulder, offset);
        const elbow = toward(top, upper, armHalf);
        const hand = toward(elbow, fore, armHalf);
        return { top, elbow, hand };
    };

    return {
        hip,
        shoulder,
        head,
        lean,
        frontLeg: front,
        backLeg: back,
        frontArm: arm(point(0.5, 0.6), pose.frontUpper, pose.frontFore),
        backArm: arm(point(-0.9, 0.4), pose.backUpper, pose.backFore)
    };
}

// --- Body parts ---

function drawArm(canvas, char, mats, arm, isBack) {
    const tone = (paint) => (isBack ? { ...paint, base: paint.dark, light: paint.base } : paint);
    const r = char.armRadius;
    const back = Math.atan2(arm.elbow.y - arm.hand.y, arm.elbow.x - arm.hand.x) * (180 / Math.PI);
    const parts = [
        [capsule(arm.top, arm.elbow, r * 1.15), mats.sleeve],
        [capsule(arm.elbow, arm.hand, r * 0.9), mats.forearm],
        [capsule(toward(arm.hand, back, 1.2), arm.hand, r * 0.95), mats.band],
        [ellipse(arm.hand.x, arm.hand.y, r + 0.65, r + 0.6), mats.hand]
    ];

    // Neighboring parts of the same color are one shape, without lines inside.
    const groups = [];
    parts.forEach(([mask, paint]) => {
        const last = groups[groups.length - 1];
        if (last && String(last.paint.base) === String(paint.base)) {
            last.mask = union(last.mask, mask);
        } else {
            groups.push({ mask, paint });
        }
    });

    groups.forEach(({ mask, paint }) => canvas.fill(mask, tone(paint)));
}

function drawLeg(canvas, char, mats, leg, isBack) {
    const tone = (paint) => (isBack ? { ...paint, base: paint.dark, light: paint.base } : paint);
    const r = char.legRadius;
    const bootTop = toward(leg.ankle, Math.atan2(leg.knee.y - leg.ankle.y, leg.knee.x - leg.ankle.x) * (180 / Math.PI), 2.2);

    canvas.fill(capsule(leg.top, leg.knee, r * 1.1), tone(mats.pants));
    canvas.fill(capsule(leg.knee, leg.ankle, r), tone(mats.pants));
    canvas.fill(union(capsule(bootTop, leg.ankle, r * 1.12), capsule(leg.ankle, add(leg.ankle, point(2.6, 0.3)), r * 0.95)), tone(mats.boots));
}

function drawTorso(canvas, char, mats, body) {
    const forward = toward(point(0, 0), body.lean, 1);
    const across = (center, depth) => [add(center, point(-forward.x * depth, -forward.y * depth)), add(center, point(forward.x * depth, forward.y * depth))];
    const [backTop, frontTop] = across(body.shoulder, char.chest / 2);
    const [backBottom, frontBottom] = across(body.hip, char.hips / 2);

    canvas.fill(polygon([backTop, frontTop, frontBottom, backBottom]), mats.top);

    if (char.belly > 0) {
        const center = add(toward(body.hip, body.lean - 90, char.torso * 0.38), point(char.chest * 0.32, 0));
        canvas.fill(ellipse(center.x, center.y, char.belly, char.belly * 1.05), mats.skin);
    }

    if (mats.shoulder) {
        canvas.fill(ellipse(body.shoulder.x - 0.3, body.shoulder.y + 0.8, 2, 1.4), mats.shoulder);
    }

    // Pants up to the waist, and the belt.
    canvas.fill(ellipse(body.hip.x, body.hip.y, char.hips / 2 + 0.3, 1.8), mats.pants);
    canvas.fill(capsule(add(backBottom, point(0, -1.4)), add(frontBottom, point(0.3, -1.4)), 0.6), mats.belt, { shade: false });
}

function drawNeck(canvas, mats, body) {
    canvas.fill(capsule(body.shoulder, body.head, 1.3), mats.skin);
}

function hairMask(hair, head, rx, ry, view) {
    const shapes = hair.shapes.map((shape) => polygon(shape.map(([x, y]) => point(head.x + x * rx, head.y + y * ry))));

    if (view === 'side') {
        return union(...shapes);
    }

    // Seen from the front: the side shapes on both sides, without the face.
    const mirrored = hair.shapes.map((shape) => polygon(shape.map(([x, y]) => point(head.x - x * rx, head.y + y * ry))));
    const face = ellipse(head.x, head.y + ry * 0.35, rx * 0.82, ry * 0.85);
    const fringe = hair.fringe.map((shape) => polygon(shape.map(([x, y]) => point(head.x + x * rx, head.y + y * ry))));

    return union(minus(union(...shapes, ...mirrored), face), ...fringe);
}

/**
 * Puts a template drawn by hand (see character-heads.js) with its anchor
 * on the given pixel.
 */
function stamp(canvas, template, x, y, mats, layer = {}) {
    const accent = mats[layer.accent || template.accent] || mats.hair;
    const second = mats[layer.second || template.second] || accent;
    const colors = {
        s: mats.skin.base, S: mats.skin.dark, l: mats.skin.light, k: mats.ink,
        w: mats.eyeWhite.base, p: mats.pupil,
        h: mats.hair.base, H: mats.hair.dark, L: mats.hair.light,
        a: accent.base, A: accent.dark, q: accent.light,
        b: second.base, B: second.dark,
        o: OUTLINE
    };
    const [ax, ay] = template.anchor;

    template.rows.forEach((row, dy) => {
        [...row].forEach((letter, dx) => {
            if (colors[letter]) {
                canvas.set(x + dx - ax, y + dy - ay, colors[letter]);
            }
        });
    });
}

/**
 * A head drawn by hand: the face, then the hair and the details.
 */
function drawPixelHead(canvas, char, mats, head, view, options) {
    const x = Math.round((head.x + 0.5) * DETAIL - 0.5) + ORIGIN.x;
    const y = Math.round((head.y + 0.5) * DETAIL - 0.5) + ORIGIN.y;

    // Small frames get the head in half of its size.
    if (DETAIL < FULL_DETAIL && char.smallHead) {
        const small = char.smallHead;
        small.forEach((row, dy) => row.forEach((color, dx) => {
            if (color) {
                canvas.set(x + dx - small.anchor.x, y + dy - small.anchor.y, color);
            }
        }));
        return;
    }

    stampHead(canvas, char, mats, x, y, view, options);
}

function stampHead(canvas, char, mats, x, y, view, { form, isHurt }) {
    let face = view === 'side' ? HEADS.FACE_SIDE : HEADS.FACE_FRONT;

    if (isHurt || char.eyes === 'squint') {
        face = HEADS.closeEyes(face);
    }

    if (form && form.hasNoBrows) {
        face = HEADS.withoutBrows(face);
    }

    stamp(canvas, face, x, y, mats);

    const layers = typeof char.headLayers === 'function' ? char.headLayers(form) : char.headLayers;

    layers.forEach((name) => {
        const parts = HEADS.HAIR[name];
        if (parts && parts[view]) {
            stamp(canvas, parts[view], x, y, mats);
        }
    });
}

function drawHead(canvas, char, mats, head, view, options) {
    if (char.headLayers) {
        drawPixelHead(canvas, char, mats, head, view, options);
        return;
    }

    const [rx, ry] = char.head;
    const colors = char.colors;

    canvas.fill(ellipse(head.x, head.y, rx, ry), mats.skin);

    if (view === 'side') {
        if (char.hasNose) {
            canvas.fill(polygon([point(head.x + rx * 0.8, head.y - ry * 0.05), point(head.x + rx + 0.7, head.y + ry * 0.3), point(head.x + rx * 0.75, head.y + ry * 0.38)]), mats.skin);
        }

        if (char.hasEars) {
            canvas.fill(ellipse(head.x - rx * 0.2, head.y + ry * 0.12, 0.65, 0.95), mats.skin);
            dot(canvas, head.x - rx * 0.2, head.y + ry * 0.12, 0.25, mats.skin.dark, 0.5);
        }
    } else if (char.hasEars) {
        [-1, 1].forEach((side) => canvas.fill(ellipse(head.x + side * (rx + 0.25), head.y + ry * 0.12, 0.6, 0.95), mats.skin));
        canvas.fill(ellipse(head.x, head.y, rx, ry), mats.skin);
    }

    drawFace(canvas, char, mats, head, view, options);

    const hair = options.form ? options.form.hair(char.hair) : char.hair;

    if (hair) {
        canvas.fill(hairMask(hair, head, rx, ry, view), mats.hair);
    }
}

function drawFace(canvas, char, mats, head, view, { isHurt, form }) {
    const [rx, ry] = char.head;
    const ink = mats.skin.line;
    const eyeY = head.y + ry * 0.08;
    const white = hex(char.colors.eyeWhite);
    const pupil = mats.pupil;
    const eyes = isHurt ? 'closed' : char.eyes;
    const hasBrows = !(form && form.hasNoBrows);

    // An eye looking forward; "side" 1 is the front of the face.
    const drawEye = (x, side) => {
        if (eyes === 'open') {
            dot(canvas, x, eyeY, 0.72, white, 0.85);
            dot(canvas, x + side * 0.25, eyeY + 0.08, 0.36, pupil, 0.55);
        } else if (eyes === 'squint') {
            stroke(canvas, point(x - 0.6, eyeY + 0.25), point(x, eyeY - 0.25), 0.22, ink);
            stroke(canvas, point(x, eyeY - 0.25), point(x + 0.6, eyeY + 0.25), 0.22, ink);
        } else {
            stroke(canvas, point(x - 0.6, eyeY + 0.2), point(x + 0.6, eyeY + 0.2), 0.22, ink);
        }
    };

    // An angry eyebrow, lower at the nose.
    const drawBrow = (x, side) => {
        if (hasBrows) {
            stroke(canvas, point(x - side * 0.85, eyeY - 1.15), point(x + side * 0.75, eyeY - 0.7), 0.3, ink);
        }
    };

    const mouthY = head.y + ry * 0.62;

    if (view === 'side') {
        const x = head.x + rx * 0.42;
        drawEye(x, 1);
        drawBrow(x, 1);

        if (char.eyes === 'squint') {
            stroke(canvas, point(head.x + rx * 0.3, mouthY - 0.2), point(head.x + rx * 0.85, mouthY + 0.1), 0.25, ink);
        } else {
            stroke(canvas, point(head.x + rx * 0.5, mouthY), point(head.x + rx * 0.82, mouthY - 0.05), 0.2, ink);
        }
    } else {
        [-1, 1].forEach((side) => {
            const x = head.x + side * rx * 0.42;
            drawEye(x, -side);
            drawBrow(x, -side);
        });

        const width = char.eyes === 'squint' ? 1.3 : 0.6;
        stroke(canvas, point(head.x - width, mouthY), point(head.x + width, mouthY), 0.2, ink);

        if (char.eyes === 'squint') {
            [-1, 1].forEach((side) => stroke(canvas, point(head.x + side * width, mouthY), point(head.x + side * (width + 0.4), mouthY - 0.4), 0.2, ink));
        }
    }
}

// --- Details of characters ---

/**
 * True when the head of the character is drawn by hand: then the details
 * of the head are in its templates, and only those of the body are drawn here.
 */
function hasPixelHead(char) {
    return Boolean(char.headLayers);
}

function headBox(char, head) {
    return { head, rx: char.head[0], ry: char.head[1] };
}

function drawKrillinDots(canvas, char, mats, body, view, head) {
    if (hasPixelHead(char)) {
        return;
    }

    const { rx, ry } = headBox(char, head);
    const top = head.y - ry * 0.62;
    const columns = view === 'side' ? [0.15, 0.55] : [-0.4, 0, 0.4];

    columns.forEach((x) => {
        dot(canvas, head.x + x * rx, top, 0.28, mats.skin.line);
        dot(canvas, head.x + x * rx, top + 1.2, 0.28, mats.skin.line);
    });
}

function drawThirdEye(canvas, char, mats, body, view, head) {
    if (hasPixelHead(char)) {
        return;
    }

    const { rx, ry } = headBox(char, head);
    const x = head.x + (view === 'side' ? rx * 0.62 : 0);
    const y = head.y - ry * 0.55;

    dot(canvas, x, y, 0.42, WHITE, 0.62);
    dot(canvas, x, y + 0.1, 0.24, mats.pupil, 0.4);
}

function drawScar(canvas, char, mats, body, view, head) {
    if (hasPixelHead(char)) {
        return;
    }

    const { rx, ry } = headBox(char, head);
    const x = head.x + (view === 'side' ? rx * 0.2 : -rx * 0.55);
    const y = head.y + ry * 0.4;
    const scar = hex('a0342c');

    stroke(canvas, point(x - 0.5, y - 0.5), point(x + 0.5, y + 0.5), 0.15, scar);
    stroke(canvas, point(x - 0.5, y + 0.5), point(x + 0.5, y - 0.5), 0.15, scar);
}

function drawAfroBack(canvas, char, mats, body, view) {
    if (hasPixelHead(char)) {
        return;
    }

    const head = body.head;
    const { rx, ry } = headBox(char, head);
    const center = view === 'side' ? point(head.x - rx * 0.35, head.y - ry * 0.55) : point(head.x, head.y - ry * 0.55);

    canvas.fill(ellipse(center.x, center.y, rx * (view === 'side' ? 1.55 : 1.75), ry * 1.25), mats.hair);
}

function drawAfro(canvas, char, mats, body, view, head) {
    if (hasPixelHead(char)) {
        return;
    }

    const { rx, ry } = headBox(char, head);
    const cap = view === 'side'
        ? [[-1.1, 0.2], [-1.1, -0.6], [-0.4, -1.15], [0.5, -1.05], [1.05, -0.55], [0.6, -0.6], [0, -0.45], [-0.6, 0.3]]
        : [[-1.05, 0], [-0.9, -0.85], [0, -1.15], [0.9, -0.85], [1.05, 0], [0.75, -0.5], [0, -0.6], [-0.75, -0.5]];

    canvas.fill(polygon(cap.map(([x, y]) => point(head.x + x * rx, head.y + y * ry))), mats.hair);

    // A thick mustache.
    const y = head.y + ry * 0.45;
    const [from, to] = view === 'side' ? [0.35, 0.95] : [-0.6, 0.6];
    stroke(canvas, point(head.x + from * rx, y + 0.15), point(head.x + to * rx, y - 0.05), 0.35, mats.hair.base);
}

function drawCape(canvas, char, mats, body, view) {
    const cape = mats.cape;

    if (view === 'side') {
        const top = add(body.shoulder, point(-1.5, 0.5));
        canvas.fill(polygon([top, add(top, point(-1.5, -0.5)), add(body.hip, point(-6, char.legs * 0.75)), add(body.hip, point(-1, char.legs * 0.8))]), cape);
    } else {
        const left = add(body.shoulder, point(-char.shoulders - 1, 0));
        const right = add(body.shoulder, point(char.shoulders + 1, 0));
        canvas.fill(polygon([left, right, add(right, point(1.5, char.torso + char.legs * 0.75)), add(left, point(-1.5, char.torso + char.legs * 0.75))]), cape);
    }
}

function drawTurban(canvas, char, mats, body, view, head) {
    const { rx, ry } = headBox(char, head);
    if (!hasPixelHead(char)) {
        const turban = view === 'side'
            ? [[-1.25, 0.1], [-1.2, -0.7], [-0.6, -1.35], [0.4, -1.35], [1.0, -0.8], [1.1, -0.35], [-0.2, -0.35]]
            : [[-1.15, -0.3], [-1.05, -0.95], [0, -1.4], [1.05, -0.95], [1.15, -0.3]];

        canvas.fill(polygon(turban.map(([x, y]) => point(head.x + x * rx, head.y + y * ry))), mats.turban);
        canvas.fill(ellipse(head.x - (view === 'side' ? rx * 0.2 : 0), head.y - ry * 1.35, rx * 0.45, ry * 0.3), mats.top);

        // Pointed ears.
        const sides = view === 'side' ? [-1] : [-1, 1];
        sides.forEach((side) => {
            const base = point(head.x + side * rx * (view === 'side' ? 0.2 : 0.95), head.y + ry * 0.1);
            canvas.fill(polygon([base, add(base, point(0, 1.6)), add(base, point(side * 2.2, -1.4))]), mats.skin);
        });
    }

    // Big white shoulder pads.
    if (view === 'side') {
        canvas.fill(ellipse(body.shoulder.x, body.shoulder.y + 0.3, 2.8, 1.8), mats.cape);
    } else {
        [-1, 1].forEach((side) => canvas.fill(ellipse(body.shoulder.x + side * char.shoulders, body.shoulder.y + 0.3, 2.4, 1.8), mats.cape));
    }
}

function drawCellWings(canvas, char, mats, body, view) {
    const shell = mats.shell;

    if (view === 'side') {
        const top = add(body.shoulder, point(-2, -0.5));
        canvas.fill(polygon([top, add(top, point(-4, 3)), add(body.hip, point(-4.5, -1)), add(body.hip, point(-1, -1))]), shell);
    } else {
        [-1, 1].forEach((side) => {
            const top = add(body.shoulder, point(side * (char.shoulders - 1), -0.5));
            canvas.fill(polygon([top, add(top, point(side * 4, 2)), add(body.hip, point(side * (char.hips + 2.5), -1)), add(body.hip, point(side * 2, -1))]), shell);
        });
    }
}

function drawCellCrest(canvas, char, mats, body, view, head) {
    const { rx, ry } = headBox(char, head);
    if (!hasPixelHead(char)) {
        const crests = view === 'side'
            ? [[[-0.25, -0.85], [0.3, -0.95], [-0.35, -2.1]], [[-0.85, -0.55], [-0.4, -0.95], [-1.6, -1.95]]]
            : [[[-0.7, -0.75], [-0.15, -0.95], [-0.95, -2.1]], [[0.7, -0.75], [0.15, -0.95], [0.95, -2.1]]];
        const shell = mats.top;

        crests.forEach((shape) => canvas.fill(polygon(shape.map(([x, y]) => point(head.x + x * rx, head.y + y * ry))), shell));

        // Purple marks on the cheeks.
        const cheek = hex('8e44ad');
        const xs = view === 'side' ? [rx * 0.3] : [-rx * 0.62, rx * 0.62];
        xs.forEach((x) => stroke(canvas, point(head.x + x, head.y + ry * 0.35), point(head.x + x, head.y + ry * 0.75), 0.18, cheek));
    }

    // Dark spots on the green shell of the torso.
    for (let y = body.shoulder.y + 0.8; y < body.hip.y - 1.5; y += 1.6) {
        for (let x = 0; x < 30; x += 1.7) {
            const spotX = x + ((y * 3) % 1.1);
            const color = canvas.get(Math.round((spotX + 0.5) * DETAIL), Math.round((y + 0.5) * DETAIL));
            if (color && (color === mats.top.base || color === mats.top.light)) {
                dot(canvas, spotX, y, 0.32, mats.top.line);
            }
        }
    }
}

function drawBubuAntenna(canvas, char, mats, body, view, head) {
    if (hasPixelHead(char)) {
        return;
    }

    const { rx, ry } = headBox(char, head);
    const curve = view === 'side'
        ? [[0.1, -0.85], [0.0, -1.5], [-0.45, -1.95], [-1.05, -1.8], [-1.3, -1.35]]
        : [[0, -0.85], [0, -1.5], [0.4, -1.95], [1.0, -1.85], [1.25, -1.4]];

    canvas.fill(chain(curve.map(([x, y]) => point(head.x + x * rx, head.y + y * ry)), 0.85), mats.skin);
}

function drawTail(canvas, char, mats, body, view) {
    if (view !== 'side') {
        const base = add(body.hip, point(char.hips / 2, 0));
        canvas.fill(chain([base, add(base, point(4, 1)), add(base, point(6, -3)), add(base, point(5, -7))], 1.1), mats.skin);
        return;
    }

    const base = add(body.hip, point(-1.5, 0));
    canvas.fill(chain([base, add(base, point(-5, 2)), add(base, point(-8.5, -1.5)), add(base, point(-8, -6))], 1.15), mats.skin);
    canvas.fill(ellipse(base.x - 8, base.y - 6, 1.1, 1.1), mats.dome);
}

function drawFreezaDome(canvas, char, mats, body, view, head) {
    const { rx, ry } = headBox(char, head);
    if (!hasPixelHead(char)) {
        const dome = view === 'side'
            ? [[-1.1, 0.05], [-1.05, -0.7], [-0.5, -1.18], [0.3, -1.18], [0.8, -0.8], [0.5, -0.45], [-0.1, -0.4], [-0.5, 0.1]]
            : [[-1.05, -0.2], [-0.9, -0.85], [0, -1.2], [0.9, -0.85], [1.05, -0.2], [0.6, -0.45], [0, -0.55], [-0.6, -0.45]];

        canvas.fill(polygon(dome.map(([x, y]) => point(head.x + x * rx, head.y + y * ry))), mats.dome);
    }

    // A purple gem on the chest.
    canvas.fill(ellipse(body.shoulder.x + (view === 'side' ? 1.5 : 0), body.shoulder.y + 2.5, 1.3, 1), mats.dome, { line: false });
}

function drawCatEars(canvas, char, mats, body, view, head) {
    const { rx, ry } = headBox(char, head);
    if (!hasPixelHead(char)) {
        const ears = view === 'side'
            ? [[[-0.55, -0.75], [0.1, -0.95], [-0.55, -2.55]], [[-1.0, -0.45], [-0.6, -0.85], [-1.45, -2.25]]]
            : [[[-0.95, -0.55], [-0.3, -0.9], [-1.15, -2.45]], [[0.95, -0.55], [0.3, -0.9], [1.15, -2.45]]];
        const pink = material('e89ab8');

        ears.forEach((shape) => {
            const points = shape.map(([x, y]) => point(head.x + x * rx, head.y + y * ry));
            canvas.fill(polygon(points), mats.skin);
            const inner = points.map((p, index) => (index === 2 ? p : add(p, point((points[2].x - p.x) * 0.3, (points[2].y - p.y) * 0.3))));
            canvas.fill(polygon(inner), pink, { line: false, shade: false });
        });
    }

    // A golden collar.
    canvas.fill(ellipse(body.shoulder.x + (view === 'side' ? 0.6 : 0), body.shoulder.y + 0.4, view === 'side' ? 2.6 : char.shoulders + 0.5, 1.2), mats.collar);
}

function drawWhisHair(canvas, char, mats, body, view, head) {
    const { rx, ry } = headBox(char, head);
    if (!hasPixelHead(char)) {
        const shape = view === 'side'
            ? [[-1.05, 0.15], [-1.0, -0.6], [-0.7, -0.85], [-0.75, -2.45], [-0.25, -2.75], [0.3, -2.45], [0.45, -0.95], [0.9, -0.65], [0.4, -0.55], [-0.4, 0.15]]
            : [[-1.0, -0.3], [-0.95, -0.8], [-0.55, -0.95], [-0.5, -2.45], [0, -2.75], [0.5, -2.45], [0.55, -0.95], [0.95, -0.8], [1.0, -0.3], [0.5, -0.6], [-0.5, -0.6]];

        canvas.fill(polygon(shape.map(([x, y]) => point(head.x + x * rx, head.y + y * ry))), mats.hair);
    }

    // The blue ring around the neck.
    canvas.fill(ellipse(body.shoulder.x + (view === 'side' ? 0.4 : 0), body.shoulder.y - 0.6, view === 'side' ? 2.8 : char.shoulders + 1, 1.1), mats.ring);
}

// --- Frames ---

function materialsOf(char, form) {
    const colors = { ...char.colors, ...(form ? form.colors : {}) };
    const mats = {};

    Object.keys(colors).forEach((key) => {
        mats[key] = material(colors[key]);
    });

    mats.sleeve = mats.sleeve || mats.skin;
    mats.forearm = mats.forearm || mats.skin;
    mats.hand = mats.hand || mats.skin;
    mats.pupil = hex(colors.pupil);
    mats.eyeWhite = material(colors.eyeWhite);
    // Brows and mouths: a very dark shade of the skin, not a reddish one.
    mats.ink = darkOutline(mats.skin.base, -3);

    return mats;
}

function drawSide(char, pose, mats, options) {
    const canvas = new Canvas();
    const body = skeleton(char, pose);

    char.behind(canvas, char, mats, body, 'side');
    drawArm(canvas, char, mats, body.backArm, true);
    drawLeg(canvas, char, mats, body.backLeg, true);
    drawNeck(canvas, mats, body);
    drawTorso(canvas, char, mats, body);

    if (mats.collar) {
        canvas.fill(capsule(add(body.shoulder, point(0.6, 0.2)), add(body.shoulder, point(1.8, 1.6)), 0.6), mats.collar, { shade: false });
    }

    drawLeg(canvas, char, mats, body.frontLeg, false);
    drawArm(canvas, char, mats, body.frontArm, false);
    canvas.removeOrphans();
    drawHead(canvas, char, mats, body.head, 'side', { ...options, isHurt: pose.isHurt });
    char.details(canvas, char, mats, body, 'side', body.head);
    if (HAS_OUTLINE) {
        canvas.outline();
    }

    return canvas;
}

function drawFront(char, pose, mats, options) {
    const canvas = new Canvas();
    const hip = point(CENTER_X + 0.5, GROUND - char.legs - char.legRadius + 0.5);
    const shoulder = point(hip.x, hip.y - char.torso);
    const head = point(hip.x, shoulder.y - 1 - char.head[1]);
    const body = { hip, shoulder, head, lean: 0 };
    const armHalf = (char.torso * 0.95) / 2;
    const legTop = (side) => add(hip, point(side * (char.hips / 2 - 0.6), 0));

    const legs = [-1, 1].map((side) => {
        const top = legTop(side);
        const ankle = point(top.x + side * 0.6, GROUND - char.legRadius);
        return { top, knee: point((top.x + ankle.x) / 2, (top.y + ankle.y) / 2), ankle, side };
    });

    const raised = { rest: [], one: [1], both: [-1, 1] }[pose.front];
    const arms = [-1, 1].map((side) => {
        const top = add(shoulder, point(side * char.shoulders, 0.6));
        const isRaised = raised.includes(side);
        const elbow = isRaised ? add(top, point(side * 1.5, -armHalf)) : add(top, point(side * 1.2, armHalf));
        const hand = isRaised ? add(elbow, point(-side * 0.5, -armHalf)) : add(elbow, point(side * 0.3, armHalf * 0.95));
        return { top, elbow, hand };
    });

    char.behind(canvas, char, mats, body, 'front');

    legs.forEach((leg) => {
        canvas.fill(capsule(leg.top, leg.ankle, char.legRadius * 1.05), mats.pants);
        canvas.fill(union(capsule(add(leg.ankle, point(0, -2)), leg.ankle, char.legRadius * 1.05), ellipse(leg.ankle.x + leg.side * 0.4, leg.ankle.y + 0.3, char.legRadius + 0.6, char.legRadius * 0.8)), mats.boots);
    });

    drawNeck(canvas, mats, body);
    canvas.fill(polygon([add(shoulder, point(-char.shoulders - 0.6, 0)), add(shoulder, point(char.shoulders + 0.6, 0)), add(hip, point(char.hips / 2 + 0.2, 0)), add(hip, point(-char.hips / 2 - 0.2, 0))]), mats.top);

    if (char.belly > 0) {
        canvas.fill(ellipse(hip.x, hip.y - char.torso * 0.4, char.belly * 1.15, char.belly), mats.skin);
    }

    if (mats.shoulder) {
        [-1, 1].forEach((side) => canvas.fill(ellipse(shoulder.x + side * char.shoulders, shoulder.y + 0.6, 1.8, 1.3), mats.shoulder));
    }

    if (mats.collar) {
        canvas.fill(polygon([add(shoulder, point(-2, -0.2)), add(shoulder, point(2, -0.2)), add(shoulder, point(0, 2.6))]), mats.collar, { shade: false });
    }

    canvas.fill(ellipse(hip.x, hip.y, char.hips / 2 + 0.6, 1.6), mats.pants);
    canvas.fill(capsule(add(hip, point(-char.hips / 2, -1.4)), add(hip, point(char.hips / 2, -1.4)), 0.6), mats.belt, { shade: false });

    arms.forEach((arm) => drawArm(canvas, char, mats, arm, false));
    canvas.removeOrphans();
    drawHead(canvas, char, mats, head, 'front', options);
    char.details(canvas, char, mats, body, 'front', head);
    if (HAS_OUTLINE) {
        canvas.outline();
    }

    return canvas;
}

function drawFrames(char, form = null, poses = POSES) {
    const mats = materialsOf(char, form);
    const options = { form };

    return poses.map((pose) => (pose.front ? drawFront(char, pose, mats, options) : drawSide(char, pose, mats, options)));
}

// --- Small heads for the maze ---

// A frame of the maze has 12x12 pixels; the head stands at its bottom.
const MINI_SIZE = 12;
// Rows of the walk: standing, then four steps (the head bobs up and down).
const MINI_BOBS = [0, -1, 0, -1, 0];

/**
 * The head of a character in half of its size: every pixel takes the most
 * common color of four, the eye is kept, and an outline goes around.
 */
function drawMiniHead(char) {
    const mats = materialsOf(char, null);
    const big = new Canvas();
    const anchor = { x: 15, y: 14 };

    stampHead(big, char, mats, anchor.x, anchor.y, 'side', {});

    // Only the head: down to the chin.
    const chin = anchor.y + 4;
    let left = WIDTH;
    let right = 0;
    let top = HEIGHT;

    for (let y = 0; y <= chin; y++) {
        for (let x = 0; x < WIDTH; x++) {
            if (big.get(x, y) !== null) {
                left = Math.min(left, x);
                right = Math.max(right, x);
                top = Math.min(top, y);
            }
        }
    }

    // Blocks of 2x2 aligned with the eye, so it gets a pixel of its own.
    const eyeX = anchor.x + 4;
    left -= (eyeX - left) % 2;
    top -= (chin + 1 - top) % 2;

    const small = [];

    for (let y = top; y <= chin; y += 2) {
        const row = [];

        for (let x = left; x <= right; x += 2) {
            const colors = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([dx, dy]) => big.get(x + dx, y + dy)).filter(Boolean);
            const counts = new Map();
            colors.forEach((color) => counts.set(String(color), (counts.get(String(color)) || 0) + 1));
            const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
            row.push(colors.length >= 2 ? colors.find((color) => String(color) === best[0]) : null);
        }

        small.push(row);
    }

    const eyeRow = Math.floor((anchor.y + 1 - top) / 2);
    const eyeColumn = Math.floor((eyeX - left) / 2);
    small[eyeRow][eyeColumn] = mats.pupil;

    // Where the middle of the head lies in the small one.
    small.anchor = { x: Math.floor((anchor.x - left) / 2), y: Math.floor((anchor.y - top) / 2) };

    return small;
}

function drawMiniFrames(char) {
    const head = drawMiniHead(char);
    const saved = [WIDTH, HEIGHT];

    [WIDTH, HEIGHT] = [MINI_SIZE, MINI_SIZE];

    const frames = MINI_BOBS.map((bob) => {
        const canvas = new Canvas();
        const offsetX = Math.floor((MINI_SIZE - head[0].length) / 2);
        const offsetY = MINI_SIZE - 1 - head.length + bob;

        head.forEach((row, y) => row.forEach((color, x) => {
            if (color) {
                canvas.set(offsetX + x, offsetY + y, color);
            }
        }));
        canvas.outline();

        return canvas;
    });

    return { frames, restore: () => ([WIDTH, HEIGHT] = saved) };
}

// --- Small figures for the flight on the cloud ---

// A smaller body with the same head (like super deformed sprites), so the
// figures fit the sky: frames of 32x34 pixels.
const FLIGHT = { detail: 0.5, width: 24, height: 24, origin: { x: 4, y: 4 } };
// On the cloud, firing the wave, and two frames of flying (Cell Jr.).
const FLIGHT_POSES = [
    POSES[0],
    POSES[4],
    { lean: 74, frontThigh: 170, frontShin: 176, backThigh: 162, backShin: 172, frontUpper: -8, frontFore: -4, backUpper: 150, backFore: 165, isAirborne: true },
    { lean: 70, frontThigh: 164, frontShin: 170, backThigh: 170, backShin: 182, frontUpper: -4, frontFore: 2, backUpper: 155, backFore: 168, isAirborne: true }
];

function drawFlightFrames(char) {
    char.smallHead = drawMiniHead(char);

    const saved = { detail: DETAIL, width: WIDTH, height: HEIGHT, origin: ORIGIN };

    DETAIL = FLIGHT.detail;
    WIDTH = FLIGHT.width;
    HEIGHT = FLIGHT.height;
    ORIGIN = FLIGHT.origin;

    const frames = drawFrames(char, null, FLIGHT_POSES);

    return {
        frames,
        restore: () => {
            DETAIL = saved.detail;
            WIDTH = saved.width;
            HEIGHT = saved.height;
            ORIGIN = saved.origin;
        }
    };
}

// --- Files ---

function writePng(colors, width, height, scale, file) {
    const raw = Buffer.alloc(width * height * 4);
    colors.forEach((color, index) => raw.set(color || [0, 0, 0, 0], index * 4));

    const rawFile = path.join(os.tmpdir(), `draw-characters-${process.pid}.rgba`);
    fs.writeFileSync(rawFile, raw);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    execFileSync('magick', [
        '-size', `${width}x${height}`, '-depth', '8', `rgba:${rawFile}`,
        '-filter', 'point', '-resize', `${scale * 100}%`, '-strip', file
    ]);
    fs.rmSync(rawFile);
}

/**
 * The frames looking to the right, then the same frames looking to the left.
 */
function writeSheet(frames, file, columns = COLUMNS) {
    const all = frames.concat(frames.map((frame) => frame.mirrored()));
    const rows = all.length / columns;
    const colors = [];

    for (let y = 0; y < rows * HEIGHT; y++) {
        for (let x = 0; x < columns * WIDTH; x++) {
            const frame = all[Math.floor(y / HEIGHT) * columns + Math.floor(x / WIDTH)];
            colors.push(frame.get(x % WIDTH, y % HEIGHT));
        }
    }

    writePng(colors, columns * WIDTH, rows * HEIGHT, SCALE, file);
}

/**
 * The card: the head and shoulders seen from the front.
 */
function writeCard(frame, file) {
    const width = 16;
    const height = 24;
    const left = 7;
    let top = 0;

    while (top < HEIGHT && frame.colors.slice(top * WIDTH, (top + 1) * WIDTH).every((color) => color === null)) {
        top++;
    }

    const colors = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            colors.push(frame.get(x + left, y + Math.max(0, top - 1)));
        }
    }

    writePng(colors, width, height, SCALE, file);
}

/**
 * The avatar in the bar of a fight: only the head, seen from the front.
 */
function writeAvatar(frame, file) {
    const width = 14;
    const height = 14;
    const left = 8;
    let top = 0;

    while (top < HEIGHT && frame.colors.slice(top * WIDTH, (top + 1) * WIDTH).every((color) => color === null)) {
        top++;
    }

    const colors = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            colors.push(frame.get(x + left, y + Math.max(0, top - 1)));
        }
    }

    writePng(colors, width, height, SCALE, file);
}


// ONLY=son-goku,vegeta draws only these characters (a quick preview).
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;

CHARACTERS.filter((char) => !ONLY || ONLY.includes(char.id)).forEach((char) => {
    const folder = (name) => path.join(pixelart, `fight/${char.id}/${char.id}-${name}.png`);
    const poster = (name) => path.join(pixelart, `posters/${char.id}/${char.id}-${name}.png`);
    const frames = drawFrames(char);

    writeSheet(frames, folder('spritesheet'));
    writeSheet(frames.map((frame) => frame.silhouette(AURA_GROW)), folder('aura-spritesheet'));
    writeSheet(frames.map((frame) => frame.silhouette(BIG_AURA_GROW)), folder('big-aura-spritesheet'));
    writeCard(frames[CARD_FRAME], poster('card'));
    writeAvatar(frames[CARD_FRAME], poster('avatar'));

    Object.keys(FORMS).filter((name) => FORMS[name].ids.includes(char.id)).forEach((name) => {
        const formFrames = drawFrames(char, FORMS[name]);
        writeSheet(formFrames, folder(`${name}-spritesheet`));
        writeAvatar(formFrames[CARD_FRAME], poster(`${name}-avatar`));
    });

    const flight = drawFlightFrames(char);
    writeSheet(flight.frames, folder('flight-spritesheet'), FLIGHT_POSES.length);
    flight.restore();

    const mini = drawMiniFrames(char);
    writeSheet(mini.frames, folder('mini-spritesheet'), MINI_BOBS.length);
    mini.restore();

    console.log(`[draw-characters] ${char.id}`);
});
