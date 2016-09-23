import Game from './game.js';

class StateManager {

    private game: Game = null;

    constructor(game: Game) {
        this.game = game;
    }

    public setupListeners(): void {
        this.game.on('all', (...args: any[]): void => {
            console.info.apply(console, args);
        }, this);
    }
}

function setup(game: Game) {
    let sm = new StateManager(game);
    sm.setupListeners();
}

export {
    setup
};
