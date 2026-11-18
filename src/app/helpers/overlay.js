const { addLabel } = require('./message');

const BACKGROUND_COLOR = 0x05060c;
const BACKGROUND_ALPHA = 0.93;
const BORDER_COLOR = 0xffe600;
const MARGIN = 10;

let current = null;

/**
 * @returns {boolean} True when something covers the game right now.
 */
function isOverlayOpen() {
    return current !== null;
}

/**
 * Covers the game with a dark panel drawn inside of it and pauses the game
 * (with its timers and music) until the panel is closed. Phaser keeps
 * rendering a paused game, so the panel is visible.
 *
 * @param {Phaser.Game} game
 * @param {function} build Gets a function which adds a text to the panel:
 *     (x, y, text, { color, anchor }) => Phaser.Text.
 * @returns {boolean} False when another panel is already open.
 */
function openOverlay(game, build) {
    if (current !== null) {
        return false;
    }

    const group = game.add.group();
    const background = game.add.graphics(0, 0, group);

    group.fixedToCamera = true;

    background.beginFill(BACKGROUND_COLOR, BACKGROUND_ALPHA);
    background.drawRect(0, 0, game.width, game.height);
    background.endFill();
    background.lineStyle(2, BORDER_COLOR, 1);
    background.drawRect(MARGIN, MARGIN, game.width - 2 * MARGIN, game.height - 2 * MARGIN);

    build((x, y, text, { color = '#fff', anchor = [0, 0] } = {}) => {
        const $text = addLabel(game, x, y, text, anchor);

        $text.fill = color;
        group.add($text);

        return $text;
    });

    // Phaser listens on window, so without this the keys pressed
    // while the panel is open would also control the game.
    game.input.enabled = false;
    game.paused = true;
    current = { game, group };

    return true;
}

function closeOverlay() {
    if (current === null) {
        return;
    }

    const { game, group } = current;

    current = null;
    group.destroy();
    game.input.enabled = true;
    game.paused = false;
}

module.exports = {
    isOverlayOpen,
    openOverlay,
    closeOverlay
};
