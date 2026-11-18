const IS_ENABLED = /[?&]debug\b/.test(window.location.search);

/**
 * Logs states and events of the game, but only when the address of the page
 * has the "debug" parameter (for example "?debug"). Silent otherwise.
 */
function debug(...args) {
    if (IS_ENABLED) {
        console.log('[7balls]', ...args);
    }
}

module.exports = {
    debug
};
