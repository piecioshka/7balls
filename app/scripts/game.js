'use strict';

import Configuration from './configuration';

import CollectingState from './states/collecting-state';
import EnemyPresentationState from './states/enemy-presentation-state';
import GameOverState from './states/game-over-state';
import LanguageState from './states/language-state';
import MealState from './states/meal-state';
import MenuState from './states/menu-state';
import MessageState from './states/message-state';
import PlayerPresentationState from './states/player-presentation-state';
import ShenronState from './states/shenron-state';
import TrainingState from './states/fight/training-state';
import VersusState from './states/fight/versus-state';
import WinnerState from './states/winner-state';

class Game {
    constructor() {
        // Create game object.
        this.game = new Phaser.Game(Configuration.GAME_WIDTH, Configuration.GAME_HEIGHT, Phaser.Canvas, Configuration.GAME_RENDER_ID);

        // List of all states.
        this.game.state.add('Collecting', CollectingState);
        this.game.state.add('EnemyPresentation', EnemyPresentationState);
        this.game.state.add('GameOver', GameOverState);
        this.game.state.add('Language', LanguageState);
        this.game.state.add('Meal', MealState);
        this.game.state.add('Menu', MenuState);
        this.game.state.add('Message', MessageState);
        this.game.state.add('PlayerPresentation', PlayerPresentationState);
        this.game.state.add('Shenron', ShenronState);
        this.game.state.add('Training', TrainingState);
        this.game.state.add('Versus', VersusState);
        this.game.state.add('Winner', WinnerState);

        // First state is screen with character choice.
        this.game.state.start('Language');
    }
}

export default Game;
