let config = require('./constants/configs');

import { Game } from './game';
import { StateManager } from './state-manager';
import { StatisticsManager } from './stats';

// Tworzymy obiekt gry.
let game = new Game(config.GAME_WIDTH, config.GAME_HEIGHT, Phaser.Canvas, config.GAME_RENDER_ID);
let stateManager = new StateManager(game);
stateManager.start();
let statsManager = new StatisticsManager(game);
statsManager.start();

// Aby się lepiej programowało.
window.game = game;
