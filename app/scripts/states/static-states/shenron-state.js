let utils = require('../../common/utils');

let { loadSoundPreferences } = require('../../helpers/audio');

/**
 * @extends Phaser.State
 */
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

        this.game.time.events.add(Phaser.Timer.SECOND * 2, this._next, this);

        loadSoundPreferences(this.game);

        this.audio.ambienceThunder.play();
    }

    _next() {
        this.audio.ambienceThunder.stop();

        utils.timeout(this, Phaser.Timer.SECOND, () => {
            this.state.start('PlayerPresentation', true, false, {
                name: this.game.player.id,
                lifetime: Phaser.Timer.SECOND * 2,
                cb: () => {
                    this.state.start('EnemyPresentation', true, false, {
                        lifetime: Phaser.Timer.SECOND * 4,
                        cb: () => {
                            this.state.start('Versus');
                        }
                    });
                }
            });
        });
    }

    _setupSound() {
        this.audio.ambienceThunder = this.add.audio('sound-ambience-thunder');
    }
}
