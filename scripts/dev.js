'use strict';

// Development mode: rebuilds the bundle on every change in src/app/,
// re-copies static files on every change in src/public/ and serves dist/
// on the first free port starting from 3000 (or on PORT, when set).

const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');
const { copyStatic, publicDirectory, targetDirectory } = require('./copy-static');

const HOST = '127.0.0.1';
const FIRST_PORT = 3000;
const COPY_DELAY = 100;

const MIME_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.ttf': 'font/ttf'
};

function startWebpack() {
    const webpack = path.resolve(__dirname, '../node_modules/.bin/webpack');
    const env = Object.assign({}, process.env, {
        NODE_OPTIONS: '--openssl-legacy-provider'
    });
    const child = spawn(webpack, ['-w', '--mode', 'development'], { stdio: 'inherit', env });

    child.on('exit', (code) => process.exit(code === null ? 1 : code));
    process.on('SIGINT', () => child.kill('SIGINT'));
    process.on('SIGTERM', () => child.kill('SIGTERM'));
}

function watchStaticFiles() {
    let timer = null;

    fs.watch(publicDirectory, { recursive: true }, () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            copyStatic();
            console.log('[dev] static files copied to dist/');
        }, COPY_DELAY);
    });
}

function resolveFile(url) {
    const pathname = decodeURIComponent(new URL(url, `http://${HOST}`).pathname);
    const file = path.join(targetDirectory, pathname.endsWith('/') ? `${pathname}index.html` : pathname);
    const isInside = file === targetDirectory || file.startsWith(targetDirectory + path.sep);

    return isInside ? file : null;
}

function handleRequest(request, response) {
    const file = resolveFile(request.url);

    if (file === null) {
        response.writeHead(403).end('Forbidden');
        return;
    }

    fs.readFile(file, (error, content) => {
        if (error) {
            response.writeHead(404).end('Not found');
            return;
        }

        response.writeHead(200, {
            'Content-Type': MIME_TYPES[path.extname(file)] || 'application/octet-stream',
            'Cache-Control': 'no-store'
        });
        response.end(content);
    });
}

function listen(server, port, isFixedPort) {
    server.once('error', (error) => {
        if (error.code === 'EADDRINUSE' && !isFixedPort) {
            listen(server, port + 1, isFixedPort);
            return;
        }

        throw error;
    });

    server.listen(port, HOST, () => {
        server.removeAllListeners('error');
        console.log(`[dev] game is available at http://${HOST}:${port}/`);
    });
}

function startServer() {
    const fixedPort = Number(process.env.PORT);
    const isFixedPort = Number.isInteger(fixedPort) && fixedPort > 0;

    listen(http.createServer(handleRequest), isFixedPort ? fixedPort : FIRST_PORT, isFixedPort);
}

fs.rmSync(targetDirectory, { recursive: true, force: true });
copyStatic();
watchStaticFiles();
startWebpack();
startServer();
