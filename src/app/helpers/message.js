const BLACK_COLOR = 'rgb(0,0,0)';
const WHITE_COLOR = 'rgb(255,255,255)';

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

function addLabel(game, x, y, text, anchor = [0, 0]) {
    let $label = game.add.text(x, y, text);

    $label.fill = '#fff';
    $label.font = 'Tahoma';
    $label.setShadow(0, 0, BLACK_COLOR, 3);
    $label.anchor.setTo(...anchor);

    return $label
}

/**
 * Tworzy text z użyciem fonta: Saiyan Sans.
 *
 * @param {Phaser.Game} game
 * @param {number} x
 * @param {number} y
 * @param {string} text
 * @param {Array} [anchor]
 * @returns {Phaser.Text}
 */
function addSaiyanLabel(game, x, y, text, anchor) {
    let $label = addLabel(game, x, y, text, anchor);
    $label.font = 'Saiyan-Sans';
    return $label;
}

function displayCentralMessage(game, { text, lifespan = Phaser.Timer.SECOND * 2, fontSize = 40, cb = () => null }) {
    let $message = addLabel(game, game.width / 2, game.height / 2, text, [0.5, 0.5]);
    $message.alpha = 0;
    $message.fontSize = fontSize;

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
    let $version = game.add.text(5, game.height - 20, 'v' + pkg.version);

    $version.font = 'Tahoma';
    $version.fontSize = '10px';
    $version.fill = '#fff';
    $version.setShadow(0, 0, BLACK_COLOR, 3);

    return $version;
}

function displaySingleLineMessage(game, text, lifespan = Phaser.Timer.SECOND * 2) {
    let fontSize = 60;
    displayHorizontalRectangle(game, lifespan);
    return displayCentralMessage(game, { text, lifespan, fontSize });
}

function displayFullscreenMessage(game, text, lifespan = Phaser.Timer.SECOND * 2) {
    let fontSize = 40;
    displayHorizontalRectangle(game, lifespan, game.height);
    return displayCentralMessage(game, { text, lifespan, fontSize });
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

function addRepeatLink(game, x, y = 333, anchor = [0.5, 0]) {
    let text = 'press ENTER to play once again';
    let $repeat = addSaiyanLabel(game, x || game.world.centerX, y, text, anchor);

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
    addSaiyanLabel,
    addRepeatLink,
    displayGameVersion,
    displaySingleLineMessage,
    displayFullscreenMessage
};
