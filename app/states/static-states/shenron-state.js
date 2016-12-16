let utils = require('../../helpers/utils');

export default class ShenronState extends Phaser.State {
    create() {
        let background = this.add.image(0, 0, 'bg-shenron-growing');

        utils.timeout(this, Phaser.Timer.SECOND, () => {
            background.loadTexture('bg-shenron');
        });

        utils.timeout(this, Phaser.Timer.SECOND * 3, () => {
            this.game.emit('game:shenron');
        });
    }
}
