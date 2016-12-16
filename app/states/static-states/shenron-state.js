

let utils = require('../../common/utils');
let { loadSoundPreferences } = require('../../helpers/audio');

export default class ShenronState extends Phaser.State {
    audio = {
        ambienceThunder: null
    };

    create() {
        let background = this.add.image(0, 0, 'bg-shenron-growing');

        utils.timeout(this, Phaser.Timer.SECOND, () => {
            background.loadTexture('bg-shenron');
        });

        this._setupSound();

        loadSoundPreferences(this.game);

        this.audio.ambienceThunder.play();

        utils.timeout(this, Phaser.Timer.SECOND * 3, () => {
            this.game.emit('game:shenron');
        });
    }

    _setupSound() {
        this.audio.ambienceThunder = this.add.audio('sound-ambience-thunder');
    }
}
