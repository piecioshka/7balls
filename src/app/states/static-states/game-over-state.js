const ROUNDS = require('../../constants/rounds');
let { addTitle, addLabel, addRepeatLink } = require('../../helpers/message');

export default class GameOverState extends Phaser.State {
    create() {
        this.add.image(0, 0, 'bg-game-over');

        let $title = addTitle(this.game, this.game.world.centerX, 110, this.game.locale.GAME_OVER, [0.5, 0]);

        let round = `${this.game.locale.ROUND} ${this.game.round + 1} / ${ROUNDS.length}: ${this.game.locale.ROUNDS[this.game.round].name}`;
        let $round = addLabel(this.game, this.game.world.centerX, 215, round, [0.5, 0]);
        $round.fill = '#ffe600';

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
        this.game.music.playSound('confirm');
        this.game.emit('game:over:try-again', { enemy: this.game.enemy });
    }
}
