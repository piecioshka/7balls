import Configuration from './configuration';
import MenuState from './states/MenuState';
import SearchingState from './states/SearchingState';
import FightState from './states/FightState';

class Game {
    constructor() {
        this.game = new Phaser.Game(Configuration.GAME_WIDTH, Configuration.GAME_HEIGHT, Phaser.Canvas, Configuration.GAME_RENDER_ID);

        this.game.state.add('Menu', MenuState);
        this.game.state.add('Searching', SearchingState);
        this.game.state.add('Fight', FightState);
        this.game.state.start('Menu');
    }
}

new Game();
