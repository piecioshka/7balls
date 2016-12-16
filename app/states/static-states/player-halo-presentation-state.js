let utils = require('../../helpers/utils');

// TODO(piecioshka): może uda się nie robić specjalnego ekranu dla bohatera z halo (można wykorzystać PlayerPresentationState)

export default class PlayerHaloPresentationState extends Phaser.State {
    create() {
        this.add.image(0, 0, 'bg-player-presentation');

        this.cacheKey = `${this.game.player.id}-halo`;

        this._displayPlayer();

        utils.timeout(this, Phaser.Timer.SECOND, () => {
            this.game.emit('game:player-halo-presents');
        });
    }

    _displayPlayer() {
        this.add.image(this._getCenterPixel('width'), this._getCenterPixel('height'), this.cacheKey);
    }

    _getCenterPixel(dimension) {
        return (this.game[dimension] / 2) - (this.cache.getImage(this.cacheKey)[dimension] / 2);
    }
}
