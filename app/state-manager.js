import BootstrapState from './states/bootstrap-state';
import LoadingState from './states/loading-state';
import CollectDragonBallsState from './states/collect-states/collect-dragon-balls-state';
import EnemyPresentationState from './states/static-states/enemy-presentation-state';
import GameOverState from './states/static-states/game-over-state';
import SelectLanguageState from './states/select-states/select-language-state';
import MealState from './states/static-states/meal-state';
import SelectPlayerState from './states/select-states/select-player-state';
import PlayerPresentationState from './states/static-states/player-presentation-state';
import PlayerHaloPresentationState from './states/static-states/player-halo-presentation-state';
import ShenronState from './states/static-states/shenron-state';
import TrainingState from './states/fight-states/training-state';
import VersusState from './states/fight-states/versus-state';
import WinnerState from './states/static-states/winner-state';
import AvoidMonstersState from './states/fly-states/avoid-monsters-state';

export class StateManager {

    game = null;

    constructor(game) {
        this.game = game;
        this.setupStates();
        this.setupNativeListeners();
        this.setupListeners();
    }

    setupStates() {
        this.game.state.add('Bootstrap', BootstrapState);
        this.game.state.add('Loading', LoadingState);
        this.game.state.add('CollectDragonBalls', CollectDragonBallsState);
        this.game.state.add('EnemyPresentation', EnemyPresentationState);
        this.game.state.add('GameOver', GameOverState);
        this.game.state.add('SelectLanguage', SelectLanguageState);
        this.game.state.add('Meal', MealState);
        this.game.state.add('SelectPlayer', SelectPlayerState);
        this.game.state.add('PlayerPresentation', PlayerPresentationState);
        this.game.state.add('PlayerHaloPresentation', PlayerHaloPresentationState);
        this.game.state.add('Shenron', ShenronState);
        this.game.state.add('Training', TrainingState);
        this.game.state.add('Versus', VersusState);
        this.game.state.add('Winner', WinnerState);
        this.game.state.add('AvoidMonsters', AvoidMonstersState);
    }

    setupNativeListeners() {
        this.game.state.onStateChange.add((newState, oldState) => {
            console.debug('Enter to new state: %s', newState);
        });
    }

    setupListeners() {
        this.game.on('all', (...args) => {
            args.unshift('[SM]');
            console.warn.apply(console, args);
        });

        this.game.on('game:bootstrap', () => {
            this.game.state.start('Loading');
        });

        this.game.on('game:loaded', () => {
            this.game.state.start('SelectLanguage');
        });

        this.game.on('game:language-selected', () => {
            this.game.state.start('SelectPlayer');
        });

        this.game.on('game:player-halo-presents', () => {
            // this.game.state.start('AvoidMonsters');
            this.game.state.start('CollectDragonBalls');
        });

        this.game.on('game:collect-dragon-balls', () => {
            this.game.state.start('Shenron');
        });

        this.game.on('player:select', () => {
            this.game.state.start('PlayerHaloPresentation');
        });

        this.game.on('game:shenron', () => {
            this.game.state.start('PlayerPresentation');
        });

        this.game.on('game:player-presents', () => {
            this.game.state.start('EnemyPresentation');
        });

        this.game.on('game:training-finished', () => {
            this.game.state.start('EnemyPresentation');
        });

        this.game.on('game:enemy-presents', () => {
            this.game.state.start('Versus');
        });

        this.game.on('game:player-rest', () => {
            this.game.state.start('Meal');
        });

        this.game.on('game:rest-finished', () => {
            this.game.state.start('Training');
        });

        this.game.on('game:over', () => {
            this.game.state.start('GameOver');
        });

        this.game.on('game:over:try-again', () => {
            this.game.state.start('SelectPlayer');
        });

        this.game.on('game:win', () => {
            this.game.state.start('Winner');
        });

        this.game.on('game:win:try-again', () => {
            this.game.state.start('SelectPlayer');
        });
    }

    start() {
        this.game.state.start('Bootstrap');
    }
}
