import runtime from './runtime';
import Game from './game.js';

class StateManager {

    private game: Game = null;

    constructor(game: Game) {
        this.game = game;
    }

    public setupListeners(): void {
        runtime.on('all', (...args: any[]): void => {
            args.unshift('[runtime]');
            console.warn.apply(console, args);
        });

        runtime.on('game:define-states', (): void => {
            this.game.state.start('Bootstrap');
        });

        runtime.on('game:bootstrap', (): void => {
            this.game.state.start('Loading');
        });

        runtime.on('game:loaded', (): void => {
            this.game.state.start('SelectLanguage');
        });

        runtime.on('game:language-selected', (): void => {
            this.game.state.start('SelectPlayer');
        });

        runtime.on('game:player-halo-presents', () => {
            this.game.state.start('CollectDragonBalls');
        });

        runtime.on('game:collect-dragon-balls', (): void => {
            this.game.state.start('Shenron');
        });

        runtime.on('player:select', (): void => {
            this.game.state.start('PlayerHaloPresentation');
        });

        runtime.on('game:shenron', (): void => {
            this.game.state.start('PlayerPresentation');
        });

        runtime.on('game:player-presents', () => {
            this.game.state.start('EnemyPresentation');
        });

        runtime.on('game:training-finished', () => {
            this.game.state.start('EnemyPresentation');
        });

        runtime.on('game:enemy-presents', () => {
            this.game.state.start('Versus');
        });

        runtime.on('game:player-rest', () => {
            this.game.state.start('Meal');
        });

        runtime.on('game:rest-finished', () => {
            this.game.state.start('Training');
        });

        runtime.on('game:over', (): void => {
            this.game.state.start('GameOver');
        });

        runtime.on('game:over:try-again', (): void => {
            this.game.state.start('SelectPlayer');
        });

        runtime.on('game:win', (): void => {
            this.game.state.start('Winner');
        });

        runtime.on('game:win:try-again', (): void => {
            this.game.state.start('SelectPlayer');
        });
    }
}

function setup(game: Game) {
    let sm = new StateManager(game);
    sm.setupListeners();
}

export {
    setup
};
