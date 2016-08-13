let { loadSoundPreferences } = require('../../helpers/audio');

/**
 * @extends Phaser.State
 */
export default class GameOverState extends Phaser.State {
    audio = {
        dramatic: null
    };

    create() {
        ga('send', 'event', 'game', 'over');

        this.add.image(0, 0, 'bg-game-over');
        this.add.button(this.game.width / 2 - this.cache.getImage('btn-try-again').width / 2, this.game.height / 2 + 40, 'btn-try-again', this._tryAgain, this);

        this.game.player.resetNumbers();

        this._setupKeyboard();
        this._setupSound();

        loadSoundPreferences(this.game);

        this.audio.dramatic.play();
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
        ga('send', 'event', 'game', 'over-try-again');

        this.audio.dramatic.stop();
        this.state.start('SelectCharacter');
    }

    _setupSound() {
        this.audio.dramatic = this.add.audio('sound-dramatic');
    }
}
