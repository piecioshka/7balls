const GAME = require('./constants/game');

import { Game } from './game';
import { StateManager } from './state-manager';
import { StatisticsManager } from './statistics-manager';

let game = new Game(GAME.WIDTH, GAME.HEIGHT, Phaser.Canvas, GAME.RENDER_ID);

let stateManager = new StateManager(game);
stateManager.start();

let statsManager = new StatisticsManager(game);
statsManager.start();

// Aby się lepiej programowało.
window.game = game;
