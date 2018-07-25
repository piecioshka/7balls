'use strict';

const fs = require('fs');

function isDirectoryExist(targetDirectory) {
    try {
        return fs.statSync(targetDirectory).isDirectory();
    } catch (e) {
        return false;
    }
}

function isFileExist(targetFile) {
    try {
        return fs.statSync(targetFile).isFile();
    } catch (e) {
        return false;
    }
}

function copy(sourceFile, targetDirectory, targetFile) {
    if (!isDirectoryExist(targetDirectory)) {
        fs.mkdirSync(targetDirectory);
    }

    if (isFileExist(targetFile)) {
        return;
    }

    fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));
}

module.exports = {
    copy
};
