let utils = require('../../helpers/utils');

export default class PlayerPresentationState extends Phaser.State {
    create() {
        this.add.image(0, 0, 'bg-player-presentation');

        this.cacheKey = this.game.player.id;

        this._displayPlayer();

        utils.timeout(this, Phaser.Timer.SECOND, () => {
            this.game.emit('game:player-presents');
        });
    }

    _displayPlayer() {
        this.add.image(this._getCenterPixel('width'), this._getCenterPixel('height'), this.cacheKey);
    }

    _getCenterPixel(dimension) {
        return (this.game[dimension] / 2) - (this.cache.getImage(this.cacheKey)[dimension] / 2);
    }
}
