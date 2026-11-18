const FULLSCREEN_KEY = 'f';
const { getLocale } = require('./locale');

/**
 * Toggles fullscreen mode with the F key and with the button in the corner
 * of the game area, on every screen of the game.
 * DOM listeners are used, because Phaser removes its own key bindings
 * on each state change.
 *
 * @param {Phaser.Game} game
 * @param {function(): boolean} isBlocked Tells if the shortcut should be ignored now.
 */
export function setupFullscreen(game, isBlocked) {
    let $area = document.getElementById('game-area');
    let $button = document.getElementById('fullscreen-toggle');

    function toggle() {
        if (game.scale.isFullScreen) {
            game.scale.stopFullScreen();
        } else {
            // The whole game area goes fullscreen (not only the canvas),
            // so the button stays visible.
            game.scale.fullScreenTarget = $area;
            game.scale.startFullScreen(false);
        }
    }

    function updateButton() {
        let locale = getLocale(game);
        let isFullScreen = game.scale.isFullScreen;

        $button.classList.toggle('is-fullscreen', isFullScreen);

        if (locale) {
            let label = isFullScreen ? locale.FULLSCREEN_EXIT : locale.FULLSCREEN_ENTER;
            $button.setAttribute('aria-label', label);
            $button.title = label;
        }
    }

    window.addEventListener('keydown', (event) => {
        let hasModifier = event.ctrlKey || event.metaKey || event.altKey;

        if (event.key.toLowerCase() !== FULLSCREEN_KEY || hasModifier || event.repeat || isBlocked()) {
            return;
        }

        toggle();
    });

    $button.addEventListener('click', () => {
        toggle();

        // Without this the focused button would react to Space and Enter,
        // which are used to play.
        $button.blur();
    });

    document.addEventListener('fullscreenchange', updateButton);
    game.on('locale:select', updateButton);
}
