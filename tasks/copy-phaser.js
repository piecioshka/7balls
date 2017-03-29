'use strict';

let path = require('path');
let { copy } = require('./copy');

let sourceFile = path.resolve('./node_modules/phaser/build/phaser.js');
let targetDirectory = path.resolve('./public/dist/');
let targetFile = path.join(targetDirectory, 'phaser.js');

copy(sourceFile, targetDirectory, targetFile);
