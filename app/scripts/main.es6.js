import Configuration from './configuration';
import FightState from './states/FightState';
import MenuState from './states/MenuState';
import SearchingState from './states/SearchingState';
import ShenronState from './states/ShenronState';

class Game {
    constructor() {
        // Create game object.
        this.game = new Phaser.Game(Configuration.GAME_WIDTH, Configuration.GAME_HEIGHT, Phaser.Canvas, Configuration.GAME_RENDER_ID);

        // List of all states.
        this.game.state.add('Fight', FightState);
        this.game.state.add('Menu', MenuState);
        this.game.state.add('Searching', SearchingState);
        this.game.state.add('Shenron', ShenronState);

        // First state is screen with character choice.
        this.game.state.start('Menu');
    }
}

new Game();
