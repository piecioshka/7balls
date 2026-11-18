const BLACK_COLOR = 'rgb(0,0,0)';
const WHITE_COLOR = 'rgb(255,255,255)';

// Every text of the game uses one pixel font in one size: 16 pixels, so
// a pixel of the font is 2x2 screen pixels, like in all images.
const TEXT_FONT = 'Press Start 2P';
const TEXT_SIZE = 16;
const TITLE_COLOR = '#ffe600';

let pkg = require('../../../package.json');
let utils = require('./utils');

function addRectangle(game, x, y, width, height) {
    let $rect = game.add.graphics(x, y);

    $rect.beginFill(WHITE_COLOR, 0.5);
    $rect.drawRect(0, 0, width, height);
    $rect.endFill();

    return $rect;
}

function displayHorizontalRectangle(game, lifespan, height = 150) {
    let $background = addRectangle(game, 0, (game.height / 2) - (height / 2), game.width, height);
    $background.alpha = 0;

    game.time.events.add(Phaser.Timer.SECOND / 4, () => {
        game.add.tween($background).to({ alpha: 1 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
    }, this);

    game.time.events.add(lifespan - Phaser.Timer.SECOND / 2, () => {
        game.add.tween($background).to({ alpha: 0 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
    }, this);

    return $background;
}

/**
 * Creates a regular text: the pixel font, never bold.
 *
 * @param {Phaser.Game} game
 * @param {number} x
 * @param {number} y
 * @param {string} text
 * @param {Array} [anchor]
 * @returns {Phaser.Text}
 */
function addLabel(game, x, y, text, anchor = [0, 0]) {
    let $label = game.add.text(x, y, text);

    $label.fill = '#fff';
    $label.font = TEXT_FONT;
    $label.fontWeight = 'normal';
    $label.fontSize = TEXT_SIZE;
    // A hard shadow, like in pixel art, instead of a blurred one.
    $label.setShadow(2, 2, BLACK_COLOR, 0);
    $label.anchor.setTo(...anchor);

    return $label
}

/**
 * Creates a title: the same font and size as every text, in yellow.
 *
 * @param {Phaser.Game} game
 * @param {number} x
 * @param {number} y
 * @param {string} text
 * @param {Array} [anchor]
 * @returns {Phaser.Text}
 */
function addTitle(game, x, y, text, anchor = [0, 0]) {
    let $title = addLabel(game, x, y, text, anchor);

    $title.fill = TITLE_COLOR;

    return $title;
}

function displayCentralMessage(game, { text, lifespan = Phaser.Timer.SECOND * 2, isTitle = false, cb = () => null }) {
    let add = isTitle ? addTitle : addLabel;
    let $message = add(game, game.width / 2, game.height / 2, text, [0.5, 0.5]);
    $message.alpha = 0;
    $message.align = 'center';

    game.time.events.add(Phaser.Timer.SECOND / 4, () => {
        game.add.tween($message).to({ alpha: 1 }, Phaser.Timer.SECOND / 4, Phaser.Easing.Linear.None, true);
    }, this);

    game.time.events.add(lifespan - Phaser.Timer.SECOND / 2, () => {
        game.add.tween($message).to({ alpha: 0 }, Phaser.Timer.SECOND / 4, Phaser.Easing.Linear.None, true);
    }, this);

    game.time.events.add(lifespan, cb, this);

    return $message;
}

function displayGameVersion(game) {
    let $version = addLabel(game, 8, game.height - 24, 'v' + pkg.version);

    return $version;
}

function displaySingleLineMessage(game, text, lifespan = Phaser.Timer.SECOND * 2) {
    displayHorizontalRectangle(game, lifespan);
    return displayCentralMessage(game, { text, lifespan });
}

/**
 * Same as displaySingleLineMessage, but written as a big title.
 */
function displayTitleMessage(game, text, lifespan = Phaser.Timer.SECOND * 2) {
    displayHorizontalRectangle(game, lifespan);
    return displayCentralMessage(game, { text, lifespan, isTitle: true });
}

function displayFullscreenMessage(game, text, lifespan = Phaser.Timer.SECOND * 2) {
    displayHorizontalRectangle(game, lifespan, game.height);
    return displayCentralMessage(game, { text, lifespan });
}

function toggleColor($text, currentColor) {
    let color = currentColor;

    return function () {
        if (color === WHITE_COLOR) {
            $text.fill = color = BLACK_COLOR;
            $text.setShadow(0, 0, WHITE_COLOR, 3);
        } else if (color === BLACK_COLOR) {
            $text.fill = color = WHITE_COLOR;
            $text.setShadow(0, 0, BLACK_COLOR, 3);
        } else {
            console.warn('ignore toggling');
        }
    }
}

/**
 * Blinking hint which tells which key moves the game on.
 */
function addRepeatLink(game, x, y = 340, anchor = [0.5, 0], text = game.locale.PLAY_AGAIN) {
    let $repeat = addLabel(game, x || game.world.centerX, y, text, anchor);

    $repeat.anchor.setTo(0.5, 0);
    $repeat.fill = WHITE_COLOR;
    $repeat.inputEnabled = true;
    $repeat.input.useHandCursor = true;

    let colorToggler = toggleColor($repeat, WHITE_COLOR);
    let currentState = game.state.getCurrentState();
    let timeInterval = Phaser.Timer.SECOND / 2;

    utils.interval(currentState, timeInterval, colorToggler);

    return $repeat;
}

module.exports = {
    addLabel,
    addTitle,
    addRepeatLink,
    displayGameVersion,
    displaySingleLineMessage,
    displayTitleMessage,
    displayFullscreenMessage
};
