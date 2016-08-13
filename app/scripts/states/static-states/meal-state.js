let utils = require('../../common/utils');
let Character = require('../../models/character');

let { shout } = require('../../helpers/message');
let { loadSoundPreferences } = require('../../helpers/audio');

/**
 * @extends Phaser.State
 */
export default class MealState extends Phaser.State {
    lifetime = null;
    cb = null;

    init({ lifetime, cb }) {
        this.lifetime = lifetime;
        this.cb = cb;
    }

    create() {
        this.add.image(0, 0, 'bg-meal-house');

        this.game.player.hp = Character.defaultNumbers.hp;

        shout(this.game, { text: `${this.game.locale.MEAL_STATE_WELCOME}` });

        utils.timeout(this, this.lifetime, this.cb);

        loadSoundPreferences(this.game);
    }
}
