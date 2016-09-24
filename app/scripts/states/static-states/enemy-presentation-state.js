import Enemy from '../../models/enemy';

import runtime from '../../runtime';

let utils = require('../../common/utils');
let { displaySingleLineMessage } = require('../../helpers/message');
let { loadSoundPreferences } = require('../../helpers/audio');

/**
 * @extends Phaser.State
 */
export default class EnemyPresentationState extends Phaser.State {

    create() {
        this.add.image(0, 0, 'bg-enemy-presentation');

        this._setupEnemy();
        this._displayEnemy();

        displaySingleLineMessage(this.game, `${this.game.locale.ENEMY_PRESENTATION_STATE_WELCOME}`);

        loadSoundPreferences(this.game);

        utils.timeout(this, Phaser.Timer.SECOND, () => {
            runtime.emit('game:enemy-presents');
        });
    }

    _setupEnemy() {
        // Pobieramy pierwszego wroga. Każde zwycięstwo eliminuje pierwszego z listy.
        let typeClass = this.game.enemies[0];

        // Współdzielimy obiekt wroga między stana w grze.
        this.game.enemy = new Enemy();
        this.game.enemy.setPersonality(typeClass);

        runtime.emit('enemy:new', { enemy: this.game.enemy });
    }

    _displayEnemy() {
        this.add.image(this._getCenterPixel('width'), this._getCenterPixel('height'), this.game.enemy.id);
    }

    _getCenterPixel(dimension) {
        return (this.game[dimension] / 2) - (this.cache.getImage(this.game.enemy.id)[dimension] / 2);
    }
}
