import BootstrapState from './states/bootstrap-state';
import LoadingState from './states/loading-state';
import CollectDragonBallsState from './states/collect-states/collect-dragon-balls-state';
import EnemyPresentationState from './states/static-states/enemy-presentation-state';
import GameOverState from './states/static-states/game-over-state';
import SelectLanguageState from './states/select-states/select-language-state';
import MealState from './states/static-states/meal-state';
import SelectPlayerState from './states/select-states/select-player-state';
import MessageState from './states/static-states/message-state';
import PlayerPresentationState from './states/static-states/player-presentation-state';
import ShenronState from './states/static-states/shenron-state';
import TrainingState from './states/fight-states/training-state';
import VersusState from './states/fight-states/versus-state';
import WinnerState from './states/static-states/winner-state';

import runtime from './runtime';

export default class Game extends Phaser.Game {

    constructor(width, height, renderer, parent, state, transparent, antialias, physicsConfig) {
        super(width, height, renderer, parent, state, transparent, antialias, physicsConfig);

        this.state.onStateChange.add((newState, oldState) => {
            console.debug("[State] %s", newState);
        });
    }

    setup() {
        // Definicja wszystkich możliwych stanów w grze.
        this.state.add('Bootstrap', BootstrapState);
        this.state.add('Loading', LoadingState);
        this.state.add('CollectDragonBalls', CollectDragonBallsState);
        this.state.add('EnemyPresentation', EnemyPresentationState);
        this.state.add('GameOver', GameOverState);
        this.state.add('SelectLanguage', SelectLanguageState);
        this.state.add('Meal', MealState);
        this.state.add('SelectPlayer', SelectPlayerState);
        this.state.add('Message', MessageState);
        this.state.add('PlayerPresentation', PlayerPresentationState);
        this.state.add('Shenron', ShenronState);
        this.state.add('Training', TrainingState);
        this.state.add('Versus', VersusState);
        this.state.add('Winner', WinnerState);

        runtime.emit('game:setup');
    }
}
