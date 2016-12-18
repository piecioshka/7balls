let { addSaiyanLabel } = require('../../helpers/message');

export default class GameOverState extends Phaser.State {
    create() {
        this.add.image(0, 0, 'bg-game-over');
        this.add.button(this.game.width / 2 - this.cache.getImage('btn-try-again').width / 2, this.game.height / 2 + 40, 'btn-try-again', this._tryAgain, this);

        let label = addSaiyanLabel(this.game, 200, 50, 'Game Over');
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
        this.game.emit('game:over:try-again', { enemy: this.game.enemy });
    }
}
