const { addTitle, addLabel, addRepeatLink } = require('../../helpers/message');

const TITLE_Y = 20;
const FIRST_ROW_Y = 66;
const ROW_HEIGHT = 22;
const KEYS_X = 300;
const LABEL_X = 330;
const KEYS_COLOR = '#ffe600';

/**
 * Screen with game controls, displayed right after the language is selected.
 * It stays until the player confirms it with ENTER (or a click).
 */
export default class ControlsState extends Phaser.State {
    create() {
        const controls = this.game.locale.CONTROLS;

        addTitle(this.game, this.game.world.centerX, TITLE_Y, controls.title, [0.5, 0]);

        controls.items.forEach(({ keys, label }, index) => {
            const y = FIRST_ROW_Y + index * ROW_HEIGHT;

            const $keys = addLabel(this.game, KEYS_X, y, keys.join('  '), [1, 0]);
            $keys.fill = KEYS_COLOR;

            addLabel(this.game, LABEL_X, y, label);
        });

        const $confirm = addRepeatLink(this.game, null, 340, [0.5, 0], controls.confirm);
        $confirm.events.onInputDown.add(this._confirm, this);

        this._setupKeyboard();
    }

    _setupKeyboard() {
        const enter = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        // Wstrzymujemy propagację zdarzeń w oknie przeglądarki.
        this.input.keyboard.addKeyCapture([
            Phaser.Keyboard.ENTER
        ]);

        enter.onDown.add((key) => {
            // ENTER still held after selecting the language repeats itself,
            // which would skip this screen before anyone could read it.
            if (key.event && key.event.repeat) {
                return;
            }

            this._confirm();
        });
    }

    _confirm() {
        this.game.music.playSound('confirm');
        this.game.emit('game:controls-confirmed');
    }
}
