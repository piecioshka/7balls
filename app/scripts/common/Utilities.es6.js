class Utilities {
    /**
     * @param {number} number
     * @param {Function} cb
     * @param {Object} ctx
     */
    static times(number, cb, ctx = this) {
        for (let i = 0; i < number; i++) {
            cb.call(ctx, i);
        }
    }

    /**
     * @param {number} start
     * @param {number} stop
     * @returns {number}
     */
    static random(start = 0, stop = 10) {
        return parseInt(Math.random() * (stop - start + 1) + start);
    }

    /**
     * @param {Phaser.State} state
     * @param {number} max
     * @param {number} lifetime
     * @param {Function} cb
     */
    static timesRandomAsync(state, max, lifetime, cb) {
        let index = 0;
        let times = Utilities.random(1, max - 1);

        (function loop() {
            Utilities.timeout(state, lifetime, () => {
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
     * @param {number} lifetime
     * @param {Function} cb
     */
    static interval(state, lifetime, cb) {
        let clock = state.time.create();
        clock.repeat(lifetime, Infinity, cb);
        clock.start();
    }

    /**
     * @param {Phaser.State} state
     * @param {number} lifetime
     * @param {function} cb
     */
    static timeout(state, lifetime, cb) {
        state.time.events.add(lifetime, cb);
    }
}

export default Utilities;
