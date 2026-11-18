const ROUNDS = require('../../constants/rounds');
import { formatPower } from '../play-states/fight-state';
const { addTitle, addLabel, addRepeatLink } = require('../../helpers/message');

const YELLOW = '#ffe600';
const LABEL_X = 400;
const VALUE_X = 430;
const FIRST_ROW_Y = 180;
const ROW_HEIGHT = 30;

/**
 * Summary displayed after every passed round: what the player achieved
 * in it, and the health and level they go on with. The next round
 * is introduced after ENTER (or a click).
 */
export default class RoundSummaryState extends Phaser.State {
    create() {
        const locale = this.game.locale;
        const texts = locale.SUMMARY;
        const index = this.game.round;
        const centerX = this.game.world.centerX;
        const player = this.game.player;

        const rows = this.game.summary.concat([
            { label: 'health', value: `${player.hp} / 100` },
            { label: 'power', value: formatPower(player.getPower()) }
        ]);

        const $number = addLabel(this.game, centerX, 14, `${locale.ROUND} ${index + 1} / ${ROUNDS.length}: ${locale.ROUNDS[index].name}`, [0.5, 0]);
        $number.fill = YELLOW;

        addTitle(this.game, centerX, 70, texts.title, [0.5, 0]);

        rows.forEach(({ label, value }, row) => {
            const y = FIRST_ROW_Y + row * ROW_HEIGHT;

            const $label = addLabel(this.game, LABEL_X, y, texts[label], [1, 0]);
            $label.fill = YELLOW;

            addLabel(this.game, VALUE_X, y, value);
        });

        const $next = addRepeatLink(this.game, null, 345, [0.5, 0], texts.confirm);
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
            // ENTER or a blow key held since the round must not skip the summary.
            if (key.event && key.event.repeat) {
                return;
            }

            this._confirm();
        });
    }

    _confirm() {
        this.game.music.playSound('confirm');
        this.game.emit('round:summary-confirmed');
    }
}
