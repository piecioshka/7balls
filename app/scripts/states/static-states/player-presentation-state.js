let utils = require('../../common/utils');
let { loadSoundPreferences } = require('../../helpers/audio');

/**
 * @extends Phaser.State
 */
export default class PlayerPresentationState extends Phaser.State {
    key = null;
    cb = null;
    lifespan = null;

    init({ key, cb, lifespan }) {
        this.key = key;
        this.cb = cb;
        this.lifespan = lifespan;
    }

    create() {
        this.add.image(0, 0, 'bg-player');

        this._displayPlayer();

        utils.timeout(this, this.lifespan, this.cb);

        loadSoundPreferences(this.game);
    }

    _displayPlayer() {
        this.add.image(this._getCenterPixel('width'), this._getCenterPixel('height'), this.key);
    }

    _getCenterPixel(dimension) {
        return (this.game[dimension] / 2) - (this.cache.getImage(this.key)[dimension] / 2);
    }
}
