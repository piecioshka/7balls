import AbstractState from './AbstractState';

class WinnerState extends AbstractState {
    sound = {
        dramatic: null
    };

    preload() {
        super.preload();

        this.load.image('bg-winner', './assets/graphics/backgrounds/bg-winner.png');
        this.load.image('btn-try-again', './assets/graphics/buttons/try-again.png');

        this.load.audio('sound-dramatic', './assets/sound/dbk/dramatic_reveal_01.ogg');
    }

    create() {
        this.add.image(0, 0, 'bg-winner');
        this.add.button(this.game.width / 2 - this.cache.getImage('btn-try-again').width / 2, this.game.height / 2 + 40, 'btn-try-again', this._tryAgain, this);

        this._setupKeyboard();
        this._setupSound();

        this.loadSoundPreferences();
        this.sound.dramatic.play();
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
        this.sound.dramatic.stop();
        this.state.start('Menu');
    }

    _setupSound() {
        this.sound.dramatic = this.add.audio('sound-dramatic');
    }
}

export default WinnerState;
