const FALLBACK_LOCALE = 'locale-en';

/**
 * Texts for things displayed outside of the game states (buttons, the help).
 * Before a language is selected, the English version is used.
 *
 * @param {Phaser.Game} game
 * @returns {?Object} Null when locale files are not loaded yet.
 */
function getLocale(game) {
    if (game.locale) {
        return game.locale;
    }

    return game.cache.checkJSONKey(FALLBACK_LOCALE) ? game.cache.getJSON(FALLBACK_LOCALE) : null;
}

module.exports = {
    getLocale
};
