'use strict';

const BLACK_COLOR = 'rgb(0,0,0)';
const WHITE_COLOR = 'rgb(255,255,255)';

const BACKGROUND_HEIGHT = 150;

let rectangle = (game, x, y, width, height) => {
    let rect = game.add.graphics(x, y);

    rect.beginFill(WHITE_COLOR, 0.5);
    rect.drawRect(0, 0, width, height);
    rect.endFill();

    return rect;
};

class AbstractState extends Phaser.State {
    preload() {
        this.load.image('mute', './assets/graphics/icons/mute.png');
        this.load.image('unmute', './assets/graphics/icons/unmute.png');

        this.load.text('font-saiyan-sans', './assets/fonts/Saiyan-Sans.ttf');
    }

    addSaiyanLabel(x, y, text, anchor = [0, 0]) {
        let label = this.add.text(x, y, text);

        label.font = 'Saiyan-Sans';
        label.fill = '#fff';
        label.setShadow(0, 0, BLACK_COLOR, 3);
        label.anchor.setTo(...anchor);

        return label;
    }

    shout({ text, lifetime = Phaser.Timer.SECOND * 2, fontSize = 100, cb = () => null }) {
        this.displayHorizontalRectangle(lifetime);
        return this.displayCentralMessage.apply(this, arguments);
    }

    displayHorizontalRectangle(lifetime) {
        let background = rectangle(this.game, 0, this.game.world.centerY - (BACKGROUND_HEIGHT / 2) + 10, this.game.width, BACKGROUND_HEIGHT);
        background.alpha = 0;

        this.game.time.events.add(Phaser.Timer.SECOND / 4, () => {
            this.add.tween(background).to({ alpha: 1 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
        }, this);

        this.game.time.events.add(lifetime - Phaser.Timer.SECOND / 2, () => {
            this.add.tween(background).to({ alpha: 0 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
        }, this,);

        return background;
    }

    displayCentralMessage({ text, lifetime = Phaser.Timer.SECOND * 2, fontSize = 100, cb = () => null }) {
        let message = this.addSaiyanLabel(this.game.world.centerX, this.game.world.centerY, text, [0.5, 0.5]);
        message.alpha = 0;
        message.fontSize = fontSize;

        this.game.time.events.add(Phaser.Timer.SECOND / 4, () => {
            this.add.tween(message).to({ alpha: 1 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
        }, this);

        this.game.time.events.add(lifetime - Phaser.Timer.SECOND / 2, () => {
            this.add.tween(message).to({ alpha: 0 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
        }, this);

        this.game.time.events.add(lifetime, cb, this);

        return message;
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
