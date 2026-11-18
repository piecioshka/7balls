import Enemy from '../../models/enemy';
import { GAUNTLETS } from '../../models/gauntlets';

const ROUNDS = require('../../constants/rounds');
const { addTitle, addLabel, addRepeatLink } = require('../../helpers/message');

const YELLOW = '#ffe600';
const KEYS_X = 400;
const LABEL_X = 430;
// The controls start below the goal, at least here.
const FIRST_ROW_Y = 176;
const ROW_HEIGHT = 22;

/**
 * Introduction displayed before every round: its number, name, goal
 * and controls. The round starts after ENTER (or a click).
 */
export default class RoundIntroState extends Phaser.State {
    create() {
        const locale = this.game.locale;
        const index = this.game.round;
        const round = locale.ROUNDS[index];
        const centerX = this.game.world.centerX;
        let goal = round.goal;

        if (ROUNDS[index].hasRival) {
            // Only to read the name and the card of the next enemy in the queue.
            const enemy = new Enemy();
            const round = ROUNDS[index];
            enemy.setPersonality(round.gauntlet ? GAUNTLETS[round.gauntlet][0] : this.game.enemies[0]);

            goal = goal.replace('{rival}', enemy.title);
            this.add.image(100, 190, `${enemy.id}-card`);
        }

        const $number = addLabel(this.game, centerX, 12, `${locale.ROUND} ${index + 1} / ${ROUNDS.length}`, [0.5, 0]);
        $number.fill = YELLOW;

        addTitle(this.game, centerX, 40, round.name, [0.5, 0]);

        const $goal = addLabel(this.game, centerX, 76, goal, [0.5, 0]);
        // Long goals are wrapped instead of running out of the screen.
        $goal.wordWrap = true;
        $goal.wordWrapWidth = 740;
        $goal.lineSpacing = 6;
        $goal.align = 'center';

        const top = Math.max(FIRST_ROW_Y, $goal.y + $goal.height + 14);

        round.controls.forEach(({ keys, label }, row) => {
            const y = top + row * ROW_HEIGHT;

            const $keys = addLabel(this.game, KEYS_X, y, keys.join('  '), [1, 0]);
            $keys.fill = YELLOW;

            addLabel(this.game, LABEL_X, y, label);
        });

        const $start = addRepeatLink(this.game, null, 345, [0.5, 0], locale.ROUND_START);
        $start.events.onInputDown.add(this._start, this);

        this._setupKeyboard();
    }

    _setupKeyboard() {
        const enter = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        // Wstrzymujemy propagację zdarzeń w oknie przeglądarki.
        this.input.keyboard.addKeyCapture([
            Phaser.Keyboard.ENTER
        ]);

        enter.onDown.add((key) => {
            // ENTER held since the previous screen repeats itself,
            // which would skip the introduction before anyone could read it.
            if (key.event && key.event.repeat) {
                return;
            }

            this._start();
        });
    }

    _start() {
        this.game.music.playSound('confirm');
        this.game.emit('round:confirmed');
    }
}
