import AbstractState from './abstract-state';
import Utilities from '../common/utilities';

class ShenronState extends AbstractState {
    sound = {
        ambienceThunder: null
    };

    preload() {
        super.preload();

        this.load.image('bg-shenron-before', './assets/graphics/backgrounds/shenron/bg-shenron-before.png');
        this.load.image('bg-shenron', './assets/graphics/backgrounds/shenron/bg-shenron.png');

        this.load.audio('sound-ambience-thunder', './assets/sound/dbk/ambience_thunder.ogg');
    }

    create() {
        this.add.image(0, 0, 'bg-shenron-before');

        Utilities.timeout(this, Phaser.Timer.SECOND, () => {
            this.add.image(0, 0, 'bg-shenron');
        });

        this._setupSound();

        this.game.time.events.add(Phaser.Timer.SECOND * 2, this._next, this);

        this.loadSoundPreferences();
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

export default ShenronState;
