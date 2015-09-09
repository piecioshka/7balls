class Computer {
    static times(number, callback, callbackContext) {
        for (let i = 0; i < number; i++) {
            callback.call(callbackContext);
        }
    }

    static applyArtificialIntelligence(character) {
        character.phaser.events.onKicking.dispatch();
        // character.phaser.events.onJumping.dispatch();
        // character.phaser.events.onSitting.dispatch();

        setTimeout(() => {
            Computer.times(30, () => {
                character.phaser.events.onLeft.dispatch();
            });

            setTimeout(() => {
                Computer.times(30, () => {
                    character.phaser.events.onBoxing.dispatch();
                    character.phaser.events.onKicking.dispatch();
                });
            }, 1000);
        }, 1000);
    }
}

export default Computer;
