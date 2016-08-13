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
 * @param {number} lifetime Number of milliseconds of delay.
 * @param {Function} cb Callback.
 */
function timesRandomAsync(state, max, lifetime, cb) {
    let index = 0;
    let times = random(1, max - 1);

    function loop() {
        timeout(state, lifetime, () => {
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
 * @param {number} lifetime Number of milliseconds of delay.
 * @param {Function} cb Callback.
 */
function interval(state, lifetime, cb) {
    let clock = state.time.create();

    clock.repeat(lifetime, Infinity, cb);
    clock.start();
}

/**
 * @param {Phaser.State} state Game state.
 * @param {number} lifetime Number of milliseconds of delay.
 * @param {function} cb Callback.
 */
function timeout(state, lifetime, cb) {
    state.time.events.add(lifetime, cb);
}

module.exports = {
    random,
    timesRandomAsync,
    interval,
    timeout
};
