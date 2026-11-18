const GAME = require('./constants/game');

import { Game } from './game';
import { StateManager } from './state-manager';
import { StatisticsManager } from './statistics-manager';
import { setupFullscreen } from './helpers/fullscreen';
import { setupShortcutsHelp } from './helpers/shortcuts-help';
import { setupKonamiCode } from './helpers/konami-code';
import { setupMusic } from './helpers/music';
import { setupRestart } from './helpers/restart';
import { isOverlayOpen } from './helpers/overlay';

// Phaser prints its banner to the console on every start.
window.PhaserGlobal = { hideBanner: true };

const game = new Game(GAME.WIDTH, GAME.HEIGHT, Phaser.Canvas, GAME.RENDER_ID);

const stateManager = new StateManager(game);
stateManager.start();

setupShortcutsHelp(game);
setupRestart(game);
setupFullscreen(game, isOverlayOpen);
setupKonamiCode(game);

// Available in the console, for example: game.music.play('duel').
game.music = setupMusic(game);

const statsManager = new StatisticsManager(game);
statsManager.start();

// For Development. Aby się lepiej programowało.
window.game = game;
