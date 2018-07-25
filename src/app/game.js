let SuperEventEmitter = require('super-event-emitter');

export class Game extends Phaser.Game {
    constructor(...args) {
        super(...args);
        SuperEventEmitter.mixin(this);

        this.locale = null;
        this.player = null;
        this.enemy = null;
        this.enemies = null;
        this.balls = null;
    }
}
