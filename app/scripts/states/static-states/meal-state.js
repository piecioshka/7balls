let utils = require('../../common/utils');
import Player from '../../models/player';

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

        this.game.player.hp = Player.defaultNumbers.hp;

        shout(this.game, { text: `${this.game.locale.MEAL_STATE_WELCOME}` });

        utils.timeout(this, this.lifetime, this.cb);

        loadSoundPreferences(this.game);
    }
}
