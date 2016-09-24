import runtime from '../../runtime';

let { loadSoundPreferences } = require('../../helpers/audio');

/**
 * @extends Phaser.State
 */
export default class GameOverState extends Phaser.State {
    audio = {
        dramatic: null
    };

    create() {
        this.add.image(0, 0, 'bg-game-over');
        this.add.button(this.game.width / 2 - this.cache.getImage('btn-try-again').width / 2, this.game.height / 2 + 40, 'btn-try-again', this._tryAgain, this);

        this._setupKeyboard();
        this._setupSound();
        loadSoundPreferences(this.game);

        // this.audio.dramatic.play();
    }

    _setupKeyboard() {
        let enter = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        // Wstrzymujemy propagację zdarzeń w oknie przeglądarki.
        this.input.keyboard.addKeyCapture([
            Phaser.Keyboard.ENTER
        ]);

        enter.onDown.add(() => this._tryAgain());
    }

    _tryAgain() {
        // this.audio.dramatic.stop();

        runtime.emit('game:over:try-again', { enemy: this.game.enemy });
    }

    _setupSound() {
        this.audio.dramatic = this.add.audio('sound-dramatic');
    }
}
