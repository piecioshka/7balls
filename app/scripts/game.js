import Configuration from './configs';

import BootstrapState from './states/bootstrap-state';
import LoadingState from './states/loading-state';
import CollectDragonBallsState from './states/collect-states/collect-dragon-balls-state';
import EnemyPresentationState from './states/static-states/enemy-presentation-state';
import GameOverState from './states/static-states/game-over-state';
import SelectLanguageState from './states/select-states/select-language-state';
import MealState from './states/static-states/meal-state';
import SelectCharacterState from './states/select-states/select-character-state';
import MessageState from './states/static-states/message-state';
import PlayerPresentationState from './states/static-states/player-presentation-state';
import ShenronState from './states/static-states/shenron-state';
import TrainingState from './states/fight-states/training-state';
import VersusState from './states/fight-states/versus-state';
import WinnerState from './states/static-states/winner-state';

export default class Game {
    constructor() {
        // Create game object.
        this.game = new Phaser.Game(Configuration.GAME_WIDTH, Configuration.GAME_HEIGHT, Phaser.Canvas, Configuration.GAME_RENDER_ID);

        // List of all states.
        this.game.state.add('Bootstrap', BootstrapState);
        this.game.state.add('Loading', LoadingState);
        this.game.state.add('CollectDragonBalls', CollectDragonBallsState);
        this.game.state.add('EnemyPresentation', EnemyPresentationState);
        this.game.state.add('GameOver', GameOverState);
        this.game.state.add('SelectLanguage', SelectLanguageState);
        this.game.state.add('Meal', MealState);
        this.game.state.add('SelectCharacter', SelectCharacterState);
        this.game.state.add('Message', MessageState);
        this.game.state.add('PlayerPresentation', PlayerPresentationState);
        this.game.state.add('Shenron', ShenronState);
        this.game.state.add('Training', TrainingState);
        this.game.state.add('Versus', VersusState);
        this.game.state.add('Winner', WinnerState);

        this.game.state.start('Bootstrap');
    }
}
