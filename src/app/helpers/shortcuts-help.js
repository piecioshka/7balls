const { getLocale } = require('./locale');
const { isOverlayOpen, openOverlay, closeOverlay } = require('./overlay');

const HELP_KEY = '?';
const CLOSE_KEY = 'Escape';

const YELLOW = '#ffe600';
const GRAY = '#9aa3b8';
const COLUMNS_X = [32, 412];
const LABEL_OFFSET = 128;
const FIRST_ROW_Y = 78;
const ROW_HEIGHT = 20;
const SECTION_GAP = 8;

/**
 * Splits the sections, in their order, into two columns of a similar height.
 *
 * @param {Object[]} sections
 * @returns {Object[][]}
 */
function splitIntoColumns(sections) {
    const heightOf = (list) => list.reduce((sum, section) => sum + section.items.length + 1, 0);
    let best = 1;

    for (let split = 1; split < sections.length; split++) {
        const tallest = Math.max(heightOf(sections.slice(0, split)), heightOf(sections.slice(split)));
        const bestTallest = Math.max(heightOf(sections.slice(0, best)), heightOf(sections.slice(best)));

        if (tallest < bestTallest) {
            best = split;
        }
    }

    return [sections.slice(0, best), sections.slice(best)];
}

/**
 * Shows a cheat sheet with game controls and all keyboard shortcuts when
 * the "?" key is pressed. It is drawn inside of the game, which is paused
 * as long as the cheat sheet is open.
 *
 * @param {Phaser.Game} game
 */
export function setupShortcutsHelp(game) {
    let isOpen = false;

    function open() {
        const locale = getLocale(game);

        if (locale === null) {
            return;
        }

        const shortcuts = locale.SHORTCUTS;

        isOpen = openOverlay(game, (addText) => {
            addText(game.width / 2, 22, shortcuts.title, { color: YELLOW, anchor: [0.5, 0] });
            addText(game.width / 2, 44, shortcuts.paused, { color: GRAY, anchor: [0.5, 0] });

            splitIntoColumns(shortcuts.sections).forEach((sections, column) => {
                const x = COLUMNS_X[column];
                let y = FIRST_ROW_Y;

                sections.forEach(({ title, items }) => {
                    addText(x, y, title, { color: YELLOW });
                    y += ROW_HEIGHT;

                    items.forEach(({ keys, label }) => {
                        addText(x, y, keys.join(' '), { color: GRAY });
                        addText(x + LABEL_OFFSET, y, label);
                        y += ROW_HEIGHT;
                    });

                    y += SECTION_GAP;
                });
            });

            addText(game.width / 2, game.height - 30, shortcuts.close, { color: YELLOW, anchor: [0.5, 0] });
        });
    }

    function close() {
        isOpen = false;
        closeOverlay();
    }

    window.addEventListener('keydown', (event) => {
        if (event.repeat) {
            return;
        }

        if (isOpen && (event.key === HELP_KEY || event.key === CLOSE_KEY)) {
            event.preventDefault();
            close();
        } else if (event.key === HELP_KEY && !isOverlayOpen()) {
            event.preventDefault();
            open();
        }
    });
}
