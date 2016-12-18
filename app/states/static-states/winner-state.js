let { addSaiyanLabel } = require('../../helpers/message');

export default class WinnerState extends Phaser.State {
    create() {
        this.add.image(0, 0, 'bg-win');
        this.add.button(370, this.game.height / 2, 'btn-try-again', this._tryAgain, this);

        let label = addSaiyanLabel(this.game, 200, 50, 'Winner!');
        label.fontSize = 100;

        this._setupKeyboard();
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
        this.game.emit('game:win:try-again', { player: this.game.player });
    }
}
