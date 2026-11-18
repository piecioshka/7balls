const { landOnNamek } = require('./background');
const { displayTitleMessage } = require('./message');
const { isSaiyan } = require('./sprites');

/**
 * During a fight a Saiyan turns into a Super Saiyan right away.
 *
 * @param {Phaser.Game} game
 */
function transformInFight(game) {
    let state = game.state.getCurrentState();
    let player = game.player;

    if (game.state.current === 'Fight' && player && isSaiyan(player) && !player.forms.saiyan) {
        state._nextSaiyanForm();
    }
}

const SEQUENCE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

/**
 * Listens for the Konami code on every screen of the game.
 * The reward: every place of the game becomes Namek, the screen shown
 * right now too, and during a fight a Saiyan becomes a Super Saiyan.
 *
 * @param {Phaser.Game} game
 */
export function setupKonamiCode(game) {
    let position = 0;

    window.addEventListener('keydown', (event) => {
        let key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

        if (event.repeat) {
            return;
        }

        if (key === SEQUENCE[position]) {
            position++;
        } else {
            // A wrong key may be the beginning of a new attempt.
            position = key === SEQUENCE[0] ? 1 : 0;
        }

        if (position < SEQUENCE.length) {
            return;
        }

        position = 0;

        // Not before the game is loaded, and only once.
        if (game.isOnNamek || !game.cache.checkImageKey('bg-namek')) {
            return;
        }

        landOnNamek(game);
        displayTitleMessage(game, 'Namek');
        transformInFight(game);
        game.emit('game:konami');
    });
}
