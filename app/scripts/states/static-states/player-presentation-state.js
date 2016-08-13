let utils = require('../../common/utils');

let { loadSoundPreferences } = require('../../helpers/audio');

/**
 * @extends Phaser.State
 */
export default class PlayerPresentationState extends Phaser.State {
    name = null;
    cb = null;
    lifetime = null;

    init({ name, cb, lifetime }) {
        this.name = name;
        this.cb = cb;
        this.lifetime = lifetime;
    }

    create() {
        this.add.image(0, 0, 'bg-player');

        this._displayPlayer();

        utils.timeout(this, this.lifetime, this.cb);

        loadSoundPreferences(this.game);
    }

    _displayPlayer() {
        this.add.image(this._getCenterPixel('width'), this._getCenterPixel('height'), this.name);
    }

    _getCenterPixel(dimension) {
        return (this.game[dimension] / 2) - (this.cache.getImage(this.name)[dimension] / 2);
    }
}
