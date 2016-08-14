import FightState from './fight-state';

let assign = require('lodash.assign');
let utils = require('../../common/utils');
let { shout } = require('../../helpers/message');
let { loadSoundPreferences } = require('../../helpers/audio');
let OptionsPlayerMixin = require('./options-player-mixin');

/**
 * @extends FightState
 */
export default class TrainingState extends FightState {
    cb = null;
    lifespan = null;
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

    init({ cb, lifespan }) {
        this.cb = cb;
        this.lifespan = lifespan;

        assign(this, OptionsPlayerMixin);
    }

    create() {
        this.add.image(0, 0, 'bg-training-capsule');

        utils.timeout(this, this.lifespan, this.cb);

        this._setupWorld();
        this._setupSound();

        this._setupSprite(150, 360, this.game.player);
        this._setupPlayerOptions();

        this._setupKeyboard();

        this.displayLogo();
        shout(this.game, { text: `${this.game.locale.TRAINING_STATE_WELCOME}` });

        loadSoundPreferences(this.game);
    }

    update() {
        super.update();
    }

    render() {
        let playerSprite = this.game.player.getSprite();
        // this.game.debug.bodyInfo(playerSprite, 25, 25);
        this.game.debug.body(playerSprite);
    }
}
