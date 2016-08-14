let utils = require('../../common/utils');
let { shout } = require('../../helpers/message');
let { loadSoundPreferences } = require('../../helpers/audio');

/**
 * @extends Phaser.State
 */
export default class MealState extends Phaser.State {
    cb = null;
    lifespan = null;

    init({ cb, lifespan }) {
        this.cb = cb;
        this.lifespan = lifespan;
    }

    create() {
        this.add.image(0, 0, 'bg-meal-house');

        this.game.player.resetHP();

        shout(this.game, { text: `${this.game.locale.MEAL_STATE_WELCOME}` });

        utils.timeout(this, this.lifespan, this.cb);

        loadSoundPreferences(this.game);
    }
}
