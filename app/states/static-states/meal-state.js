let utils = require('../../helpers/utils');
let { displaySingleLineMessage } = require('../../helpers/message');

export default class MealState extends Phaser.State {

    create() {
        this.add.image(0, 0, 'bg-meal-house');

        this.game.player.resetHP();

        displaySingleLineMessage(this.game, `${this.game.locale.MEAL_STATE_WELCOME}`);

        utils.timeout(this, Phaser.Timer.SECOND * 3, () => {
            this.game.emit('game:rest-finished');
        });
    }
}
