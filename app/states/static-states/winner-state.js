let { addSaiyanLabel } = require('../../helpers/message');

export default class WinnerState extends Phaser.State {
    create() {
        this.add.image(0, 0, 'bg-win');
        addSaiyanLabel(this.game, 180, 60, 'Winner!').fontSize = 180;
        this.add.button(370, 300, 'btn-try-again', this._tryAgain, this);
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
