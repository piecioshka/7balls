import runtime from '../../runtime';

let utils = require('../../common/utils');
let { displaySingleLineMessage } = require('../../helpers/message');
let { loadSoundPreferences } = require('../../helpers/audio');

/**
 * @extends Phaser.State
 */
export default class MealState extends Phaser.State {

    create() {
        this.add.image(0, 0, 'bg-meal-house');

        this.game.player.resetHP();

        displaySingleLineMessage(this.game, `${this.game.locale.MEAL_STATE_WELCOME}`);

        utils.timeout(this, Phaser.Timer.SECOND * 3, () => {
            runtime.emit('game:rest-finished');
        });

        loadSoundPreferences(this.game);
    }
}
