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

        // Achievements of the last passed round: [{ label, value }].
        this.summary = [];

        // Index of the round being played, see constants/rounds.js.
        this.round = 0;

        // The Konami code moves the game from Earth to Namek.
        // When the current game was started, for the summary (milliseconds).
        this.startedAt = 0;

        this.isOnNamek = false;
    }
}
