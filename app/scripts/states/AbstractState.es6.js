class AbstractState extends Phaser.State {
    preload() {
        this.load.image('mute', './assets/graphics/icons/mute.png');
        this.load.image('unmute', './assets/graphics/icons/unmute.png');
    }

    showWelcomeMessage({ text = 'Not defined message', time = Phaser.Timer.SECOND * 2, cb = () => {}}) {
        let message = this.add.text(this.game.width / 2, this.game.height / 2, text);
        message.alpha = 0;
        message.fontSize = 40;
        message.fill = '#fff';
        message.anchor.set(0.5, 0.5);
        message.setShadow(0, 0, 'rgba(0,0,0,0.5)', 10);

        this.game.time.events.add(Phaser.Timer.SECOND / 4, () => {
            this.add.tween(message).to({ alpha: 1 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
        }, this, message);

        this.game.time.events.add(time - Phaser.Timer.SECOND / 2, () => {
            this.add.tween(message).to({ alpha: 0 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
        }, this, message);

        this.game.time.events.add(time, cb, this, message);
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
