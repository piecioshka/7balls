let utils = require('../common/utils');

export default class Computer {
    static applyArtificialIntelligence(state, character) {
        function walkingLeft() {
            utils.timesRandomAsync(state, 10, Phaser.Timer.SECOND / 20, () => {
                character.phaser.events.onLeft.dispatch();
            });
        }

        function walkingRight() {
            utils.timesRandomAsync(state, 10, Phaser.Timer.SECOND / 20, () => {
                character.phaser.events.onRight.dispatch();
            });
        }

        function boxing() {
            utils.timesRandomAsync(state, 5, Phaser.Timer.SECOND / 4, () => {
                character.phaser.events.onBoxing.dispatch();
            });
        }

        function kicking() {
            utils.timesRandomAsync(state, 5, Phaser.Timer.SECOND / 4, () => {
                character.phaser.events.onKicking.dispatch();
            });
        }

        function jumping() {
            character.phaser.events.onJumping.dispatch();
        }

        function sitting() {
            character.phaser.events.onSitting.dispatch();
        }

        let moves = [
            walkingLeft, walkingRight
        ];

        let dodge = [
            jumping, sitting
        ];

        let fight = [
            boxing, kicking
        ];

        function start(intervalTime, strategy) {
            utils.interval(state, intervalTime, () => {
                let random = utils.random(0, strategy.length - 1);
                let move = strategy[random];

                move();
            });
        }

        start(Phaser.Timer.SECOND / 2, moves);
        start(Phaser.Timer.SECOND * 3 / 4, dodge);
        start(Phaser.Timer.SECOND, fight);
    }
}
