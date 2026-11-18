const ROUNDS = require('../../constants/rounds');
import { formatPower } from '../play-states/fight-state';
const { addTitle, addLabel, addRepeatLink } = require('../../helpers/message');

const YELLOW = '#ffe600';
const LABEL_X = 400;
const VALUE_X = 430;
const FIRST_ROW_Y = 165;
const ROW_HEIGHT = 30;

/**
 * @param {number} milliseconds
 * @returns {string} For example "3:07".
 */
function formatTime(milliseconds) {
    const seconds = Math.round(milliseconds / 1000);

    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

/**
 * Summary of the whole game, displayed after the last round.
 * Like every summary, it stays until ENTER (or a click).
 */
export default class WinnerState extends Phaser.State {
    create() {
        const locale = this.game.locale;
        const texts = locale.SUMMARY;
        const centerX = this.game.world.centerX;
        const player = this.game.player;

        const rows = [
            { label: 'rounds', value: `${ROUNDS.length} / ${ROUNDS.length}` },
            { label: 'gameTime', value: formatTime(Date.now() - this.game.startedAt) },
            { label: 'health', value: `${player.hp} / 100` },
            { label: 'power', value: formatPower(player.getPower()) }
        ];

        this.add.image(0, 0, 'bg-win');
        addTitle(this.game, centerX, 50, locale.WINNER, [0.5, 0]);

        rows.forEach(({ label, value }, row) => {
            const y = FIRST_ROW_Y + row * ROW_HEIGHT;

            const $label = addLabel(this.game, LABEL_X, y, texts[label], [1, 0]);
            $label.fill = YELLOW;

            addLabel(this.game, VALUE_X, y, value);
        });

        const $next = addRepeatLink(this.game, null, 300, [0.5, 0], texts.confirm);
        $next.events.onInputDown.add(this._confirm, this);

        this._setupKeyboard();
    }

    _setupKeyboard() {
        const enter = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        // Wstrzymujemy propagację zdarzeń w oknie przeglądarki.
        this.input.keyboard.addKeyCapture([
            Phaser.Keyboard.ENTER
        ]);

        enter.onDown.add((key) => {
            if (key.event && key.event.repeat) {
                return;
            }

            this._confirm();
        });
    }

    _confirm() {
        this.game.music.playSound('confirm');
        this.game.emit('game:credits');
    }
}
