class Utilities {
    /**
     * @param {number} number
     * @param {Function} callback
     * @param {Object} callbackContext
     */
    static times(number, callback, callbackContext = this) {
        for (let i = 0; i < number; i++) {
            callback.call(callbackContext, i);
        }
    }

    /**
     * @param {number} start
     * @param {number} stop
     * @returns {number}
     */
    static random(start = 0, stop = 10) {
        return parseInt(Math.random() * (stop - start) + start);
    }

    /**
     * @param {Phaser.State} state
     * @param {number} max
     * @param {number} time
     * @param {Function} cb
     */
    static timesRandomAsync(state, max, time, cb) {
        let index = 0;
        let times = Utilities.random(1, max);

        (function loop() {
            Utilities.timeout(state, time, () => {
                index++;
                cb();

                if (index < times) {
                    loop();
                }
            });
        }());
    }

    /**
     * @param {Phaser.State} state
     * @param {number} time
     * @param {Function} cb
     */
    static interval(state, time, cb) {
        let clock = state.time.create();
        clock.repeat(time, Infinity, cb);
        clock.start();
    }

    /**
     * @param {Phaser.State} state
     * @param {number} time
     * @param {function} cb
     */
    static timeout(state, time, cb) {
        state.time.events.add(time, cb);
    }
}

export default Utilities;
