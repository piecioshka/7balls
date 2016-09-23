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

let EventEmitter = require('super-event-emitter');
let config = require('./configs');

export default class Game {
    game = null;

    constructor() {
        // Tworzymy obiekt gry.
        this.game = new Phaser.Game(config.GAME_WIDTH, config.GAME_HEIGHT, Phaser.Canvas, config.GAME_RENDER_ID);

        this.game.state.onStateChange.add((newState, oldState) => {
            console.debug("[State] %s", newState);
        });

        // Rozszerzamy obiekt gry o zdarzenia, aby np. podłączyć statystyki.
        EventEmitter.mixin(this.game);

        // Definicja wszystkich możliwych stanów w grze.
        this.game.state.add('Bootstrap', BootstrapState);
        this.game.state.add('Loading', LoadingState);
        this.game.state.add('CollectDragonBalls', CollectDragonBallsState);
        this.game.state.add('EnemyPresentation', EnemyPresentationState);
        this.game.state.add('GameOver', GameOverState);
        this.game.state.add('SelectLanguage', SelectLanguageState);
        this.game.state.add('Meal', MealState);
        this.game.state.add('SelectPlayer', SelectPlayerState);
        this.game.state.add('Message', MessageState);
        this.game.state.add('PlayerPresentation', PlayerPresentationState);
        this.game.state.add('Shenron', ShenronState);
        this.game.state.add('Training', TrainingState);
        this.game.state.add('Versus', VersusState);
        this.game.state.add('Winner', WinnerState);

        this.game.state.start('Bootstrap');
    }

    on(name, handler, context) {
        return this.game.on.apply(this.game, arguments);
    }
}
