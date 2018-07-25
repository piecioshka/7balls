let { addSaiyanLabel, addLabel, addRepeatLink } = require('../../helpers/message');

let pkg = require('../../../package.json');

export default class CreditsState extends Phaser.State {
    create() {
        this.add.image(0, 0, 'bg-credits');

        addSaiyanLabel(this.game, this.game.world.centerX, 20, 'Credits', [0.5, 0]).fontSize = 60;

        addLabel(this.game, this.game.world.centerX, 110, 'Developed by', [0.5, 0]).fontSize = 20;
        addLabel(this.game, this.game.world.centerX, 140, 'Piotr Kowalski', [0.5, 0]).fontSize = 30;
        addLabel(this.game, this.game.world.centerX, 180, '@piecioshka', [0.5, 0]).fontSize = 30;
        let $version = addLabel(this.game, this.game.world.centerX, 260, `v${pkg.version}`, [0.5, 0]);
        $version.setShadow(0, 0, null, 0);
        $version.fill = 'rgba(0,0,0,1)';
        $version.fontSize = 20;

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
