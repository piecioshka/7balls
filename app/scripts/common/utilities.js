class Utilities {

    /**
     * @param {number} start Number which is down limit.
     * @param {number} stop Number which is up limit.
     * @returns {number}
     */
    static random(start = 0, stop = 10) {
        return parseInt(Math.random() * (stop - start + 1) + start, 10);
    }

    /**
     * @param {Phaser.State} state Game state.
     * @param {number} max Number of maximum times.
     * @param {number} lifetime Number of milliseconds of delay.
     * @param {Function} cb Callback.
     */
    static timesRandomAsync(state, max, lifetime, cb) {
        let index = 0;
        let times = Utilities.random(1, max - 1);

        (function loop() {
            Utilities.timeout(state, lifetime, () => {
                index++;

                if (index < times) {
                    loop();
                }

                cb();
            });
        }());
    }

    /**
     * @param {Phaser.State} state Game state.
     * @param {number} lifetime Number of milliseconds of delay.
     * @param {Function} cb Callback.
     */
    static interval(state, lifetime, cb) {
        let clock = state.time.create();

        clock.repeat(lifetime, Infinity, cb);
        clock.start();
    }

    /**
     * @param {Phaser.State} state Game state.
     * @param {number} lifetime Number of milliseconds of delay.
     * @param {function} cb Callback.
     */
    static timeout(state, lifetime, cb) {
        state.time.events.add(lifetime, cb);
    }
}

export default Utilities;
