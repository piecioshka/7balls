import Player from '../../models/player';
import Character from '../../models/character';

import SonGoku from '../../models/species/saiyans/son-goku';
import Vegeta from '../../models/species/saiyans/vegeta';
import Goten from '../../models/species/saiyans/goten';
import Trunks from '../../models/species/saiyans/trunks';
import Gohan from '../../models/species/saiyans/gohan';
import Piccolo from '../../models/species/monsters/piccolo';
import Krillin from '../../models/species/humans/krillin';
import Yamcha from '../../models/species/humans/yamcha';
import Tien from '../../models/species/humans/tien';
import MrSatan from '../../models/species/humans/mr-satan';

import { DUELS } from '../../models/gauntlets';

import { addTitle, addLabel } from '../../helpers/message';
import { addBackground } from '../../helpers/background';

// Fighters are laid out in a grid, row by row.
const FIGHTERS = [SonGoku, Vegeta, Gohan, Goten, Trunks, Piccolo, Krillin, Yamcha, Tien, MrSatan];
const COLUMNS = 5;
const COLUMN_WIDTH = 150;
const ROW_HEIGHT = 156;
const FIRST_CARD_X = 75;
const FIRST_CARD_Y = 64;

export default class SelectPlayerState extends Phaser.State {
    cardsIndex = null;
    cards = null;
    clouds = null;

    create() {
        this.cardsIndex = 0;
        this.cards = [];
        this.$selected = null;

        // Rivals of the duels, in the order of the rounds.
        this.game.enemies = DUELS.slice();

        addBackground(this);

        this.clouds = this.add.group();
        this.clouds.create(-50, 30, 'cloud');
        this.clouds.create(260, 10, 'cloud');
        this.clouds.create(480, 20, 'cloud');

        addTitle(this.game, this.game.world.centerX, 22, this.game.locale.SELECT_PLAYER, [0.5, 0]);

        FIGHTERS.forEach((typeClass, index) => {
            // Only to read the name and the card of the fighter.
            const fighter = new Character();
            fighter.setPersonality(typeClass);

            const x = FIRST_CARD_X + (index % COLUMNS) * COLUMN_WIDTH;
            const y = FIRST_CARD_Y + Math.floor(index / COLUMNS) * ROW_HEIGHT;
            const $card = this.add.button(x, y, `${fighter.id}-card`, () => this._chooseCharacter(typeClass));

            $card.onInputOver.add(() => this._select(index));
            this.cards.push($card);

            addLabel(this.game, x + $card.width / 2, y + $card.height + 4, fighter.title, [0.5, 0]);
        });

        this._setupKeyboard();
        // Domyślnie wybieramy Son Goku.
        this._select(0);
    }

    _chooseCharacter(typeClass) {
        // Współdzielimy obiekt playera między stanami w grze.
        this.game.music.playSound('confirm');
        this.game.player = new Player();
        this.game.player.setPersonality(typeClass);

        this.game.emit('player:select', { player: this.game.player });
    }

    _setupKeyboard() {
        let left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        let right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        let up = this.input.keyboard.addKey(Phaser.Keyboard.UP);
        let down = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        let enter = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        // Wstrzymujemy propagację zdarzeń w oknie przeglądarki.
        this.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.ENTER
        ]);

        left.onDown.add(() => this._move(-1));
        right.onDown.add(() => this._move(1));
        up.onDown.add(() => this._move(-COLUMNS));
        down.onDown.add(() => this._move(COLUMNS));
        enter.onDown.add((key) => {
            // ENTER held since the previous screen repeats itself,
            // which would choose a character before anyone could see them.
            if (key.event && key.event.repeat) {
                return;
            }

            this.cards[this.cardsIndex].onInputUp.dispatch();
        });
    }

    update() {
        this.clouds.children.forEach((item, index) => {
            item.position.x += (Math.log(index + 2) / 5);

            if (item.position.x > this.game.world.width) {
                item.position.x = -1 * item.width;
            }
        }, this);
    }

    /**
     * Moves the selection in the grid, if there is a card in that direction.
     *
     * @param {number} step Number of cards: 1 goes right, COLUMNS goes down.
     */
    _move(step) {
        const index = this.cardsIndex + step;
        const isSameRow = Math.floor(index / COLUMNS) === Math.floor(this.cardsIndex / COLUMNS);
        const isHorizontal = Math.abs(step) === 1;

        if (index < 0 || index >= this.cards.length || (isHorizontal && !isSameRow)) {
            return;
        }

        this._select(index);
    }

    /**
     * Highlights a card. A sound only when the highlighted card really
     * changes, so not for the default one and not for every move
     * of the mouse over it.
     */
    _select(index) {
        const $card = this.cards[index];

        if (this.$selected !== null && this.$selected !== $card) {
            this.game.music.playSound('select');
        }

        this.$selected = $card;
        this.cardsIndex = index;
        this.cards.forEach(($other) => {
            $other.alpha = $other === $card ? 1 : 0.5;
        });
    }
}
