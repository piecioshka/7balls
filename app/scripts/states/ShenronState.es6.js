import AbstractState from './AbstractState';

class ShenronState extends AbstractState {
    sound = {
        ambienceThunder: null
    };

    preload() {
        super.preload();

        this.load.image('bg-shenron', './assets/graphics/backgrounds/bg-shenron.jpg');
        this.load.audio('sound-ambience-thunder', './assets/sound/dbk/ambience_thunder.ogg');
    }

    create() {
        this.add.image(0, 0, 'bg-shenron');

        this.time.events.add(Phaser.Timer.SECOND * 2, this._setupFight, this);

        this.loadSoundPreferences();
        this._setupSound();
    }

    _setupFight() {
        this.state.start('Fight');
        this.sound.ambienceThunder.stop();
    }

    _setupSound() {
        this.sound.ambienceThunder = this.add.audio('sound-ambience-thunder');
        this.sound.ambienceThunder.play();
    }

    update() {

    }

    render() {

    }
}

export default ShenronState;
