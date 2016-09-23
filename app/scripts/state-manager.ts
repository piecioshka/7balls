import runtime from './runtime';

class StateManager {

    private game: Phaser.Game = null;

    constructor(game: Phaser.Game) {
        this.game = game;
    }

    public setupListeners(): void {
        runtime.on('all', (...args: any[]): void => {
            console.info.apply(console, args);
        }, this);

        runtime.on('game:setup', (): void => {
            this.game.state.start('Bootstrap');
        }, this);
    }
}

function setup(game: Phaser.Game) {
    let sm = new StateManager(game);
    sm.setupListeners();
}

export {
    setup
};
