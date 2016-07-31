
import Utilities from '../../common/utilities';

import { loadSoundPreferences } from '../../helpers/audio';

export default class ShenronState extends Phaser.State {
    sound = {
        ambienceThunder: null
    };

    create() {
        this.add.image(0, 0, 'bg-shenron-growing');

        Utilities.timeout(this, Phaser.Timer.SECOND, () => {
            this.add.image(0, 0, 'bg-shenron');
        });

        this._setupSound();

        this.game.time.events.add(Phaser.Timer.SECOND * 2, this._next, this);

        loadSoundPreferences(this.game);
        this.sound.ambienceThunder.play();
    }

    _next() {
        this.sound.ambienceThunder.stop();

        Utilities.timeout(this, Phaser.Timer.SECOND, () => {
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
        this.sound.ambienceThunder = this.add.audio('sound-ambience-thunder');
    }
}
