let utils = require('../helpers/utils');

function setup(state, sprite) {
    function walkingLeft() {
        utils.timesRandomAsync(state, 10, Phaser.Timer.SECOND / 20, () => {
            sprite.events.onLeft.dispatch();
        });
    }

    function walkingRight() {
        utils.timesRandomAsync(state, 10, Phaser.Timer.SECOND / 20, () => {
            sprite.events.onRight.dispatch();
        });
    }

    function boxing() {
        utils.timesRandomAsync(state, 5, Phaser.Timer.SECOND / 4, () => {
            sprite.events.onBoxing.dispatch();
        });
    }

    function kicking() {
        utils.timesRandomAsync(state, 5, Phaser.Timer.SECOND / 4, () => {
            sprite.events.onKicking.dispatch();
        });
    }

    function jumping() {
        sprite.events.onJumping.dispatch();
    }

    let moves = [
        walkingLeft, walkingRight
    ];

    let dodge = [
        jumping
    ];

    let fight = [
        boxing, kicking
    ];

    function start(intervalTime, strategy) {
        utils.interval(state, intervalTime, () => {
            if (!sprite.alive) {
                return;
            }

            let random = utils.random(0, strategy.length - 1);
            let move = strategy[random];

            move();
        });
    }

    start(Phaser.Timer.SECOND, fight);
    start(Phaser.Timer.SECOND / 2, moves);
    start(Phaser.Timer.SECOND / 3, dodge);
}

module.exports = {
    setup
};
