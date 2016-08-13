const BLACK_COLOR = 'rgb(0,0,0)';
const WHITE_COLOR = 'rgb(255,255,255)';

const BACKGROUND_HEIGHT = 150;

let pkg = require('../../../package.json');

let addRectangle = (game, x, y, width, height) => {
    let rect = game.add.graphics(x, y);

    rect.beginFill(WHITE_COLOR, 0.5);
    rect.drawRect(0, 0, width, height);
    rect.endFill();

    return rect;
};

let displayHorizontalRectangle = (game, lifetime) => {
    let background = addRectangle(game, 0, (game.height / 2) - (BACKGROUND_HEIGHT / 2) + 10, game.width, BACKGROUND_HEIGHT);
    background.alpha = 0;

    game.time.events.add(Phaser.Timer.SECOND / 4, () => {
        game.add.tween(background).to({ alpha: 1 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
    });

    game.time.events.add(lifetime - Phaser.Timer.SECOND / 2, () => {
        game.add.tween(background).to({ alpha: 0 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
    });

    return background;
};

function addLabel(game, x, y, text, anchor = [0, 0]) {
    let label = game.add.text(x, y, text);

    label.fill = '#fff';
    label.setShadow(0, 0, BLACK_COLOR, 3);
    label.anchor.setTo(...anchor);

    return label
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
let addSaiyanLabel = (game, x, y, text, anchor) => {
    let label = addLabel(game, x, y, text, anchor);
    label.font = 'Saiyan-Sans';
    return label;
};

let shout = (game, { text, lifetime = Phaser.Timer.SECOND * 2, fontSize = 80, cb = () => null }) => {
    displayHorizontalRectangle(game, lifetime);
    return displayCentralMessage(game, { text, lifetime, fontSize, cb });
};

let displayCentralMessage = (game, { text, lifetime = Phaser.Timer.SECOND * 2, fontSize = 40, cb = () => null }) => {
    let message = addLabel(game, game.width / 2, game.height / 2, text, [0.5, 0.5]);
    message.alpha = 0;
    message.fontSize = fontSize;

    game.time.events.add(Phaser.Timer.SECOND / 4, () => {
        game.add.tween(message).to({ alpha: 1 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
    });

    game.time.events.add(lifetime - Phaser.Timer.SECOND / 2, () => {
        game.add.tween(message).to({ alpha: 0 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
    });

    game.time.events.add(lifetime, cb);

    return message;
};

let displayGameVersion = (game) => {
    let version = game.add.text(5, game.height - 20, 'v' + pkg.version);

    version.font = 'Arial';
    version.fontSize = '10px';
    version.fill = '#fff';
    version.setShadow(0, 0, BLACK_COLOR, 3);

    return version;
};

module.exports = {
    addSaiyanLabel,
    shout,
    displayCentralMessage,
    displayGameVersion
};
