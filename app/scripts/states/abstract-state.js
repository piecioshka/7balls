'use strict';

class AbstractState extends Phaser.State {
    preload() {
        this.load.image('mute', './assets/graphics/icons/mute.png');
        this.load.image('unmute', './assets/graphics/icons/unmute.png');

        this.load.text('font-saiyan-sans', './assets/fonts/Saiyan-Sans.ttf');
    }

    addSaiyanLabel(x, y, text, anchor = [0, 0]) {
        const label = this.add.text(x, y, text);

        label.font = 'Saiyan-Sans';
        label.fill = '#fff';
        label.setShadow(0, 0, 'rgba(0,0,0,1)', 3);
        label.anchor.setTo(...anchor);

        return label;
    }

    displayCentralMessage({ text, lifetime = Phaser.Timer.SECOND * 2, fontSize = 100, cb = () => null }) {
        const message = this.addSaiyanLabel(this.game.width / 2, this.game.height / 2, text, [0.5, 0.5]);

        message.alpha = 0;
        message.fontSize = fontSize;

        this.game.time.events.add(Phaser.Timer.SECOND / 4, () => {
            this.add.tween(message).to({ alpha: 1 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
        }, this, message);

        this.game.time.events.add(lifetime - Phaser.Timer.SECOND / 2, () => {
            this.add.tween(message).to({ alpha: 0 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
        }, this, message);

        this.game.time.events.add(lifetime, cb, this, message);
    }

    loadSoundPreferences() {
        const key = 'dbp-sound-mute';
        const modes = ['unmute', 'mute'];
        const translateState = () => modes[Number(this.game.sound.mute)];

        this.game.sound.mute = Boolean(Number(localStorage.getItem(key)));

        const mute = this.add.button(this.game.width - 36, this.game.height - 36, translateState());

        mute.onInputDown.add(() => {
            this.game.sound.mute = !this.game.sound.mute;
            localStorage.setItem(key, Number(this.game.sound.mute));
            mute.loadTexture(translateState());
        }, this);
    }
}

export default AbstractState;
