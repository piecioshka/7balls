'use strict';

let { copy } = require('./copy');

let sourceFile = './node_modules/phaser/build/phaser.js';
let targetDirectory = './public/dist/';
let targetFile = targetDirectory + 'phaser.js';

copy(sourceFile, targetDirectory, targetFile);
