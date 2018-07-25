let { addSaiyanLabel, addRepeatLink } = require('../../helpers/message');

export default class GameOverState extends Phaser.State {
    create() {
        this.add.image(0, 0, 'bg-game-over');

        let $title = addSaiyanLabel(this.game, this.game.world.centerX, 50, 'Game Over', [0.5, 0]);
        $title.fontSize = 130;

        let $repeat = addRepeatLink(this.game);
        $repeat.events.onInputDown.add(this._tryAgain, this);

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
