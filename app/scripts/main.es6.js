'use strict';

import Configuration from './configuration';

import CollectingState from './states/CollectingState';
import EnemyPresentationState from './states/EnemyPresentationState';
import GameOverState from './states/GameOverState';
import LanguageState from './states/LanguageState';
import MealState from './states/MealState';
import MenuState from './states/MenuState';
import MessageState from './states/MessageState';
import PlayerPresentationState from './states/PlayerPresentationState';
import ShenronState from './states/ShenronState';
import TrainingState from './states/fight/TrainingState';
import VersusState from './states/fight/VersusState';
import WinnerState from './states/WinnerState';

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

new Game();
