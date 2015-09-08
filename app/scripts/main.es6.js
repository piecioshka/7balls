import Configuration from './configuration';

import GameOverState from './states/GameOverState';
import MealState from './states/MealState';
import MenuState from './states/MenuState';
import MessageState from './states/MessageState';
import SearchingState from './states/SearchingState';
import ShenronState from './states/ShenronState';

import TrainingState from './states/fight/TrainingState';
import VersusState from './states/fight/VersusState';

class Game {
    constructor() {
        // Create game object.
        this.game = new Phaser.Game(Configuration.GAME_WIDTH, Configuration.GAME_HEIGHT, Phaser.Canvas, Configuration.GAME_RENDER_ID);

        // List of all states.
        this.game.state.add('GameOver', GameOverState);
        this.game.state.add('Meal', MealState);
        this.game.state.add('Menu', MenuState);
        this.game.state.add('Message', MessageState);
        this.game.state.add('Searching', SearchingState);
        this.game.state.add('Shenron', ShenronState);
        this.game.state.add('Training', TrainingState);
        this.game.state.add('Versus', VersusState);

        // First state is screen with character choice.
        this.game.state.start('Message', true, false, {
            body: 'Welcome!\n\nGame control:\n - Navigation: LEFT, RIGHT, UP, DOWN\n - Fight: X, C',
            lifetime: Phaser.Timer.SECOND * 2,
            callback: () => {
                this.game.state.start('Menu');
            }
        });
    }
}

new Game();
