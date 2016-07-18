import AbstractState from './abstract-state';

class WinnerState extends AbstractState {
    sound = {
        thing1: null
    };

    preload() {
        super.preload();

        this.load.image('bg-winner', './assets/graphics/backgrounds/bg-winner.png');
        this.load.image('btn-try-again', './assets/graphics/buttons/try-again.png');

        this.load.audio('sound-thing1', './assets/sound/dbk/thing1.ogg');
    }

    create() {
        ga('send', 'event', 'game', 'win');

        this.add.image(0, 0, 'bg-winner');
        this.add.button(370, this.game.height / 2, 'btn-try-again', this._tryAgain, this);

        this._setupKeyboard();
        this._setupSound();

        this.loadSoundPreferences();
        this.sound.thing1.play();
    }

    _setupKeyboard() {
        let enter = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        // Stop the following keys from propagating up to the browser.
        this.input.keyboard.addKeyCapture([
            Phaser.Keyboard.ENTER
        ]);

        enter.onDown.add(() => this._tryAgain());
    }

    _tryAgain() {
        ga('send', 'event', 'game', 'win-try-again');

        this.sound.thing1.stop();
        this.state.start('Menu');
    }

    _setupSound() {
        this.sound.thing1 = this.add.audio('sound-thing1');
    }
}

export default WinnerState;
