class AbstractState extends Phaser.State {
    preload() {
        this.load.image('mute', './assets/graphics/icons/mute.png');
        this.load.image('unmute', './assets/graphics/icons/unmute.png');
    }

    loadSoundPreferences() {
        let key = 'dbp-sound-mute';
        let modes = ['unmute', 'mute'];
        let translateState = () => modes[Number(this.game.sound.mute)];

        this.game.sound.mute = Boolean(Number(localStorage.getItem(key)));

        let mute = this.add.button(this.game.width - 36, this.game.height - 36, translateState());

        mute.onInputDown.add(() => {
            this.game.sound.mute = !this.game.sound.mute;
            localStorage.setItem(key, Number(this.game.sound.mute));
            mute.loadTexture(translateState());
        }, this);
    }
}

export default AbstractState;
