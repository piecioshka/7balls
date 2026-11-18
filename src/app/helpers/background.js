const EARTH = 'bg-select-player';
const NAMEK = 'bg-namek';

/**
 * Adds the landscape to a screen: Earth by default, or the place given
 * by its key. After the Konami code it is always Namek.
 * The image is kept in the state, so it can be swapped while it is displayed.
 *
 * @param {Phaser.State} state
 * @param {?string} [key] Key of the landscape, for example "bg-city".
 * @returns {Phaser.Image}
 */
function addBackground(state, key = null) {
    state.$background = state.add.image(0, 0, state.game.isOnNamek ? NAMEK : key || EARTH);
    return state.$background;
}

/**
 * Moves the game to Namek, including the screen displayed right now.
 *
 * @param {Phaser.Game} game
 */
function landOnNamek(game) {
    let state = game.state.getCurrentState();

    game.isOnNamek = true;

    if (state && state.$background && state.$background.alive) {
        state.$background.loadTexture(NAMEK);
    }
}

module.exports = {
    addBackground,
    landOnNamek
};
