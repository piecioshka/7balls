import Utilities from '../common/utilities';

class Computer {
    static applyArtificialIntelligence(state, character) {
        const walkingLeft = () => {
            Utilities.timesRandomAsync(state, 10, Phaser.Timer.SECOND / 20, () => {
                character.phaser.events.onLeft.dispatch();
            });
        };
        const walkingRight = () => {
            Utilities.timesRandomAsync(state, 10, Phaser.Timer.SECOND / 20, () => {
                character.phaser.events.onRight.dispatch();
            });
        };
        const boxing = () => {
            Utilities.timesRandomAsync(state, 5, Phaser.Timer.SECOND / 4, () => {
                character.phaser.events.onBoxing.dispatch();
            });
        };
        const kicking = () => {
            Utilities.timesRandomAsync(state, 5, Phaser.Timer.SECOND / 4, () => {
                character.phaser.events.onKicking.dispatch();
            });
        };
        const jumping = () => {
            character.phaser.events.onJumping.dispatch();
        };
        const sitting = () => {
            character.phaser.events.onSitting.dispatch();
        };

        const moves = [
            walkingLeft, walkingRight
        ];

        const dodge = [
            jumping, sitting
        ];

        const fight = [
            boxing, kicking
        ];

        const start = (intervalTime, strategy) => {
            Utilities.interval(state, intervalTime, () => {
                const random = Utilities.random(0, strategy.length - 1);
                const move = strategy[random];

                move();
            });
        };

        start(Phaser.Timer.SECOND / 2, moves);
        start(Phaser.Timer.SECOND * 3 / 4, dodge);
        start(Phaser.Timer.SECOND, fight);
    }
}

export default Computer;
