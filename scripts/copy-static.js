'use strict';

// Copies everything the game needs at runtime (besides the webpack bundle)
// into dist/: static files from src/public/ and the Phaser build.

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const publicDirectory = path.join(root, 'src/public');
const targetDirectory = path.join(root, 'dist');
const phaserFile = path.join(root, 'node_modules/phaser/build/phaser.js');

function copyStatic() {
    fs.mkdirSync(targetDirectory, { recursive: true });
    fs.cpSync(publicDirectory, targetDirectory, { recursive: true });
    fs.copyFileSync(phaserFile, path.join(targetDirectory, 'phaser.js'));
}

module.exports = { copyStatic, publicDirectory, targetDirectory };

if (require.main === module) {
    copyStatic();
}
