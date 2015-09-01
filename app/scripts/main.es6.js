// ECMAScript 6

class Game {
    constructor() {
        console.log('Game');
        this.game = new Phaser.Game(800, 200, Phaser.Canvas, 'game');
    }
}

new Game();
