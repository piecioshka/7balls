import Game from './game';

let game = new Game();

require('./stats').setup(game);

// Aby się lepiej programowało.
window.game = game;
