import Game from './game';

let game = new Game();

require('./state-manager.ts').setup(game);
require('./stats').setup(game);

// Aby się lepiej programowało.
window.game = game;
