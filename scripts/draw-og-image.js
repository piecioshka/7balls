'use strict';

// Draws the Open Graph image (1200x630) from the art of the game: the
// landscape, the logo, the name and Son Goku and Vegeta in their winning
// poses, all enlarged twice without smoothing. Run it after the art
// generators, so it shows the current characters.
// Requires ImageMagick (`magick`).
//
// Usage: node scripts/draw-og-image.js

const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const pixelart = path.join(root, 'src/public/assets/pixelart');
const font = path.join(root, 'src/public/assets/fonts/PressStart2P-Regular.ttf');
const output = path.join(root, 'src/public/og-image.png');

// A frame of a fight sheet (150x200): column and row of the winning poses.
const FRAME = { width: 150, height: 200 };
const POSES = { left: [1, 3], right: [0, 3] };

const frame = (id, [column, row]) => [
    // +gravity: the crop counts from the top left corner, whatever the gravity outside.
    '(', '+gravity', path.join(pixelart, `fight/${id}/${id}-spritesheet.png`),
    '-crop', `${FRAME.width}x${FRAME.height}+${column * FRAME.width}+${row * FRAME.height}`, '+repage',
    '-filter', 'point', '-resize', '200%', ')'
];

execFileSync('magick', [
    path.join(pixelart, 'backgrounds/select-player/select-player.png'),
    '-filter', 'point', '-resize', '1200x630^', '-gravity', 'north', '-extent', '1200x630',
    '(', path.join(pixelart, 'logo/logo.png'), '-filter', 'point', '-resize', '200%', ')',
    '-gravity', 'north', '-geometry', '+0+30', '-composite',
    '(', '-background', 'none', '-fill', '#ffe600', '-stroke', 'black', '-strokewidth', '3',
    '-font', font, '-pointsize', '64', 'label:BALLS', ')',
    '-gravity', 'north', '-geometry', '+0+310', '-composite',
    '(', '-background', 'none', '-fill', 'white', '-stroke', 'black', '-strokewidth', '2',
    '-font', font, '-pointsize', '32', '-interline-spacing', '18', '-gravity', 'center',
    'label:Game based on\nDragon Ball', ')',
    '-gravity', 'north', '-geometry', '+0+430', '-composite',
    ...frame('son-goku', POSES.left), '-gravity', 'southwest', '-geometry', '+20-10', '-composite',
    ...frame('vegeta', POSES.right), '-gravity', 'southeast', '-geometry', '+20-10', '-composite',
    '-strip', output
]);

console.log(`[draw-og-image] ${path.relative(root, output)}`);
