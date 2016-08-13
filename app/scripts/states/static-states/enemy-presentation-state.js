let utils = require('../../common/utils');

let { shout } = require('../../helpers/message');
let { loadSoundPreferences } = require('../../helpers/audio');

/**
 * @extends Phaser.State
 */
export default class EnemyPresentationState extends Phaser.State {
    cb = null;
    lifetime = null;

    init({ cb, lifetime }) {
        this.cb = cb;
        this.lifetime = lifetime;
    }

    create() {
        this.add.image(0, 0, 'bg-enemy');

        this._setupEnemy();
        this._displayEnemy();

        shout(this.game, { text: `${this.game.locale.ENEMY_PRESENTATION_STATE_WELCOME}!` });

        utils.timeout(this, this.lifetime, this.cb);

        loadSoundPreferences(this.game);
    }

    _setupEnemy() {
        // Pobieramy pierwszego wroga. Każde zwycięstwo eliminuje pierwszego z listy.
        let Enemy = this.game.enemies[0];

        // Współdzielimy obiekt wroga między stana w grze.
        this.game.enemy = new Enemy();

        this.game.emit('enemy:new', { enemy: this.game.enemy });
    }

    _displayEnemy() {
        this.add.image(this._getCenterPixel('width'), this._getCenterPixel('height'), this.game.enemy.id);
    }

    _getCenterPixel(dimension) {
        return (this.game[dimension] / 2) - (this.cache.getImage(this.game.enemy.id)[dimension] / 2);
    }
}
