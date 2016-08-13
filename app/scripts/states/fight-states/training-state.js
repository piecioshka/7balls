let utils = require('../../common/utils');

let { shout } = require('../../helpers/message');
let { loadSoundPreferences } = require('../../helpers/audio');

import FightState from './fight-state';

/**
 * @extends FightState
 */
export default class TrainingState extends FightState {
    lifetime = null;
    cb = null;
    audio = {
        jump: null,

        weakkick: null,
        weakpunch: null,

        mediumkick: null,
        mediumpunch: null,

        strongkick: null,
        strongpunch: null
    };
    options = {
        player: {
            hp: null,
            exp: null,
            lvl: null
        }
    };

    init({ lifetime, cb }) {
        this.lifetime = lifetime;
        this.cb = cb;
    }

    create() {
        this.add.image(0, 0, 'bg-training-capsule');

        utils.timeout(this, this.lifetime, this.cb);

        this._setupWorld();
        this._setupKeyboard();
        this._setupSound();

        this._setupSprite(150, 360, this.game.player);
        this._setupPlayerOptions();

        this.displayLogo();
        shout(this.game, { text: `${this.game.locale.TRAINING_STATE_WELCOME}` });

        loadSoundPreferences(this.game);
    }

    update() {
        super.update();
    }

    render() {
        // let player = this.game.player;
        // this.game.debug.bodyInfo(player.phaser, 25, 25);
        // this.game.debug.body(player.phaser);
    }
}
