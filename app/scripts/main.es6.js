import Configuration from './configuration';
import MenuState from './states/MenuState';

class Game {
    constructor() {
        this.game = new Phaser.Game(Configuration.GAME_WIDTH, Configuration.GAME_HEIGHT, Phaser.Canvas, Configuration.GAME_RENDER_ID);

        this.game.state.add('Menu', MenuState);
        this.game.state.start('Menu');
    }
}

new Game();
