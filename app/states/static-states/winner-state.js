let { addSaiyanLabel } = require('../../helpers/message');

export default class WinnerState extends Phaser.State {
    create() {
        this.add.image(0, 0, 'bg-win');
        addSaiyanLabel(this.game, 180, 60, 'Winner!').fontSize = 180;

        setTimeout(() => {
            this.game.emit('game:credits');
        }, 2000);
    }
}
