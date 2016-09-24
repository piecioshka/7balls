import Game from './game';

let config = require('./configs');

// Tworzymy obiekt gry.
let game = new Game(config.GAME_WIDTH, config.GAME_HEIGHT, Phaser.Canvas, config.GAME_RENDER_ID);

game.state.onStateChange.add((newState, oldState) => {
    // console.debug("[State] %s", newState);
});

require('./state-manager').setup(game);
require('./stats').setup();

game.setup();

// Aby się lepiej programowało.
window.game = game;
