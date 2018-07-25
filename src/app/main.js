const GAME = require('./constants/game');

import { Game } from './game';
import { StateManager } from './state-manager';
import { StatisticsManager } from './statistics-manager';

const game = new Game(GAME.WIDTH, GAME.HEIGHT, Phaser.Canvas, GAME.RENDER_ID);

const stateManager = new StateManager(game);
stateManager.start();

const statsManager = new StatisticsManager(game);
statsManager.start();

// For Development. Aby się lepiej programowało.
window.game = game;
