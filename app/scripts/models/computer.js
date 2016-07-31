import Utilities from '../common/utilities';

export default class Computer {
    static applyArtificialIntelligence(state, character) {
        let walkingLeft = () => {
            Utilities.timesRandomAsync(state, 10, Phaser.Timer.SECOND / 20, () => {
                character.phaser.events.onLeft.dispatch();
            });
        };
        let walkingRight = () => {
            Utilities.timesRandomAsync(state, 10, Phaser.Timer.SECOND / 20, () => {
                character.phaser.events.onRight.dispatch();
            });
        };
        let boxing = () => {
            Utilities.timesRandomAsync(state, 5, Phaser.Timer.SECOND / 4, () => {
                character.phaser.events.onBoxing.dispatch();
            });
        };
        let kicking = () => {
            Utilities.timesRandomAsync(state, 5, Phaser.Timer.SECOND / 4, () => {
                character.phaser.events.onKicking.dispatch();
            });
        };
        let jumping = () => {
            character.phaser.events.onJumping.dispatch();
        };
        let sitting = () => {
            character.phaser.events.onSitting.dispatch();
        };

        let moves = [
            walkingLeft, walkingRight
        ];

        let dodge = [
            jumping, sitting
        ];

        let fight = [
            boxing, kicking
        ];

        let start = (intervalTime, strategy) => {
            Utilities.interval(state, intervalTime, () => {
                let random = Utilities.random(0, strategy.length - 1);
                let move = strategy[random];

                move();
            });
        };

        start(Phaser.Timer.SECOND / 2, moves);
        start(Phaser.Timer.SECOND * 3 / 4, dodge);
        start(Phaser.Timer.SECOND, fight);
    }
}
