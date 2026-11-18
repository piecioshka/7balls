let utils = require('../helpers/utils');
const FIGHT = require('../constants/fight');

function setup(state, $sprite) {
    function walkingLeft() {
        utils.timesRandomAsync(state, 10, Phaser.Timer.SECOND / 20, () => {
            $sprite.events.onLeft.dispatch();
        });
    }

    function walkingRight() {
        utils.timesRandomAsync(state, 10, Phaser.Timer.SECOND / 20, () => {
            $sprite.events.onRight.dispatch();
        });
    }

    function boxing() {
        utils.timesRandomAsync(state, 5, Phaser.Timer.SECOND / 4, () => {
            $sprite.events.onBoxing.dispatch();
        });
    }

    function kicking() {
        utils.timesRandomAsync(state, 5, Phaser.Timer.SECOND / 4, () => {
            $sprite.events.onKicking.dispatch();
        });
    }

    function jumping() {
        $sprite.events.onJumping.dispatch();
    }

    function wave() {
        $sprite.events.onWave.dispatch();
    }

    function dodging() {
        if (!$sprite.alive || !$sprite.body.onFloor()) {
            return;
        }

        $sprite.isDodging = true;
        utils.timeout(state, FIGHT.DODGE_TIME, () => {
            $sprite.isDodging = false;
        });
    }

    function start(intervalTime, strategy) {
        utils.interval(state, intervalTime, () => {
            if (!$sprite.alive) {
                return;
            }

            let random = utils.random(0, strategy.length - 1);
            let move = strategy[random];

            move();
        });
    }

    start(Phaser.Timer.SECOND, [boxing, kicking]);
    start(Phaser.Timer.SECOND / 3, [walkingLeft, walkingRight]);
    start(Phaser.Timer.SECOND * 5, [jumping]);
    start(Phaser.Timer.SECOND * 3, [dodging]);
    start(Phaser.Timer.SECOND * 4, [wave]);
}

module.exports = {
    setup
};
