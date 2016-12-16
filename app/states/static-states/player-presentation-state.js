

let utils = require('../../common/utils');
let { loadSoundPreferences } = require('../../helpers/audio');

export default class PlayerPresentationState extends Phaser.State {
    audio = {
        scouter: null
    };

    create() {
        this.add.image(0, 0, 'bg-player-presentation');

        this.cacheKey = this.game.player.id;

        this._setupSound();
        this._displayPlayer();

        loadSoundPreferences(this.game);

        // Dodajemy efekty audio.
        this.audio.scouter.play();

        utils.timeout(this, Phaser.Timer.SECOND, () => {
            this.game.emit('game:player-presents');
        });
    }

    _setupSound() {
        this.audio.scouter = this.add.audio('scouter');
    }

    _displayPlayer() {
        this.add.image(this._getCenterPixel('width'), this._getCenterPixel('height'), this.cacheKey);
    }

    _getCenterPixel(dimension) {
        return (this.game[dimension] / 2) - (this.cache.getImage(this.cacheKey)[dimension] / 2);
    }
}
