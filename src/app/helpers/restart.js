const { isOverlayOpen, openOverlay, closeOverlay } = require('./overlay');

const RESTART_KEY = 'r';
const CONFIRM_KEY = 'Enter';
const CANCEL_KEY = 'Escape';
const YELLOW = '#ffe600';

/**
 * Restarts the game with the R key, after a confirmation drawn inside
 * of the game: ENTER restarts, Esc goes back to the game.
 *
 * @param {Phaser.Game} game
 */
export function setupRestart(game) {
    let isAsking = false;

    function ask() {
        // Nothing to restart before a language is selected.
        if (!game.locale) {
            return;
        }

        const texts = game.locale.RESTART;
        const centerX = game.width / 2;

        isAsking = openOverlay(game, (addText) => {
            addText(centerX, 130, texts.question, { anchor: [0.5, 0] });
            addText(centerX, 190, texts.confirm, { color: YELLOW, anchor: [0.5, 0] });
            addText(centerX, 222, texts.cancel, { anchor: [0.5, 0] });
        });
    }

    function answer(isConfirmed) {
        isAsking = false;
        closeOverlay();

        if (isConfirmed) {
            game.music.playSound('confirm');
            game.emit('game:restart');
        }
    }

    window.addEventListener('keydown', (event) => {
        const hasModifier = event.ctrlKey || event.metaKey || event.altKey;

        if (event.repeat || hasModifier) {
            return;
        }

        if (isAsking && (event.key === CONFIRM_KEY || event.key === CANCEL_KEY)) {
            event.preventDefault();
            answer(event.key === CONFIRM_KEY);
        } else if (event.key.toLowerCase() === RESTART_KEY && !isOverlayOpen()) {
            ask();
        }
    });
}
