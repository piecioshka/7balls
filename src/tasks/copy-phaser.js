'use strict';

const path = require('path');
const { copy } = require('./copy');

const sourceFile = path.resolve('./node_modules/phaser/build/phaser.js');
const targetDirectory = path.resolve('./src/public/dist/');
const targetFile = path.join(targetDirectory, 'phaser.js');

copy(sourceFile, targetDirectory, targetFile);
