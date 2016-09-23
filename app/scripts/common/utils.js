/**
 * @param {number} start Number which is down limit.
 * @param {number} stop Number which is up limit.
 * @returns {number}
 */
function random(start = 0, stop = 10) {
    return parseInt(Math.random() * (stop - start + 1) + start, 10);
}

/**
 * @param {Phaser.State} state Game state.
 * @param {number} max Number of maximum times.
 * @param {number} delay Number of milliseconds of delay.
 * @param {Function} cb Callback.
 */
function timesRandomAsync(state, max, delay, cb) {
    let index = 0;
    let times = random(1, max - 1);

    function loop() {
        timeout(state, delay, () => {
            index++;

            if (index < times) {
                loop();
            }

            cb();
        });
    }

    loop();
}

/**
 * @param {Phaser.State} state Game state.
 * @param {number} delay Number of milliseconds of delay.
 * @param {Function} cb Callback.
 */
function interval(state, delay, cb) {
    let clock = state.time.create();

    clock.repeat(delay, Infinity, cb);
    clock.start();
}

/**
 * @param {Phaser.State} state Game state.
 * @param {number} delay Number of milliseconds of delay.
 * @param {Function} cb Callback.
 */
function timeout(state, delay, cb) {
    state.time.events.add(delay, cb, this);
}

module.exports = {
    random,
    timesRandomAsync,
    interval,
    timeout
};
