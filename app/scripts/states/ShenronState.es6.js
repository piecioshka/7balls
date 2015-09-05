class ShenronState {
    sound = {
        ambienceThunder: null
    };

    preload() {
        this.load.image('bg-shenron', './assets/graphics/backgrounds/bg-shenron.jpg');
        this.load.audio('sound-ambience-thunder', './assets/sound/dbk/ambience_thunder.ogg');
    }

    create() {
        this.add.image(0, 0, 'bg-shenron');
        this.sound.ambienceThunder = this.add.audio('sound-ambience-thunder');

        this.time.events.add(Phaser.Timer.SECOND * 2, this._setupFight, this);
        this.sound.ambienceThunder.play();
    }

    _setupFight() {
        this.state.start('Fight');
        this.sound.ambienceThunder.stop();
    }

    update() {

    }

    render() {

    }
}

export default ShenronState;
