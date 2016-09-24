import Player from '../../models/player';

import SonGoku from '../../models/species/saiyans/son-goku';
import Vegeta from '../../models/species/saiyans/vegeta';

import Piccolo from '../../models/species/monsters/piccolo';
import Freeza from '../../models/species/monsters/freeza';
import Cell from '../../models/species/monsters/cell';
import Bubu from '../../models/species/monsters/bubu';

import runtime from '../../runtime';

let { displayGameVersion } = require('../../helpers/message');
let { loadSoundPreferences } = require('../../helpers/audio');

/**
 * @extends Phaser.State
 */
export default class SelectPlayerState extends Phaser.State {
    gokuCard = null;
    vegetaCard = null;
    piccoloCard = null;

    cardsIndex = 0;
    cards = null;

    init() {
        this.cards = [];
        this.game.enemies = [Freeza, Cell, Bubu];
    }

    create() {
        this.add.image(0, 0, 'bg-select-player');

        this.gokuCard = this.add.button(220, 180, 'son-goku-card', () => this._chooseCharacter(SonGoku), this);
        this.gokuCard.onInputOver.add(this._selectSonGoku, this);
        this.cards.push(this.gokuCard);

        this.vegetaCard = this.add.button(420, 180, 'vegeta-card', () => this._chooseCharacter(Vegeta), this);
        this.vegetaCard.onInputOver.add(this._selectVegeta, this);
        this.cards.push(this.vegetaCard);

        this.piccoloCard = this.add.button(520, 180, 'piccolo-card', () => this._chooseCharacter(Piccolo), this);
        this.piccoloCard.onInputOver.add(this._selectPiccolo, this);
        this.piccoloCard.visible = false;

        this._setupKeyboard();

        // Domyślnie wybieramy Son Goku.
        this._selectSonGoku();

        displayGameVersion(this.game);
        loadSoundPreferences(this.game);
    }

    _chooseCharacter(typeClass) {
        // Współdzielimy obiekt playera między stanami w grze.
        this.game.player = new Player();
        this.game.player.setPersonality(typeClass);

        runtime.emit('player:select', { player: this.game.player });
    }

    _setupKeyboard() {
        let left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        let right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        // Wstrzymujemy propagację zdarzeń w oknie przeglądarki.
        this.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT
        ]);

        left.onDown.add(() => this._prevCard());
        right.onDown.add(() => this._nextCard());
    }

    update() {
        this._handleKeyboard();
    }

    _handleKeyboard() {
        let keyboard = this.input.keyboard;

        if (keyboard.isDown(Phaser.Keyboard.ENTER)) {
            this.cards[this.cardsIndex].onInputUp.dispatch();
        }

        // keyboard.isDown(Phaser.Keyboard.LEFT)
        // keyboard.isDown(Phaser.Keyboard.RIGHT)
        // keyboard.isDown(Phaser.Keyboard.DOWN)
        // keyboard.isDown(Phaser.Keyboard.ENTER)

        // A'la Konami Code
        if (
            keyboard.isDown(Phaser.Keyboard.A) &&
            keyboard.isDown(Phaser.Keyboard.B) &&
            keyboard.isDown(Phaser.Keyboard.UP)
        ) {
            if (this.piccoloCard.visible) {
                return;
            }

            this.gokuCard.x = 120;
            this.vegetaCard.x = 320;
            this.piccoloCard.visible = true;

            this.cards.push(this.piccoloCard);
        }
    }

    _prevCard() {
        this.cardsIndex--;

        if (this.cardsIndex < 0) {
            this.cardsIndex = 0;
        }

        this.cards[this.cardsIndex].onInputOver.dispatch();
    }

    _nextCard() {
        this.cardsIndex++;

        if (this.cardsIndex >= this.cards.length) {
            this.cardsIndex = this.cards.length - 1;
        }

        this.cards[this.cardsIndex].onInputOver.dispatch();
    }

    _selectSonGoku() {
        this.gokuCard.alpha = 1;
        this.vegetaCard.alpha = 0.5;
        this.piccoloCard.alpha = 0.5;
    }

    _selectVegeta() {
        this.gokuCard.alpha = 0.5;
        this.vegetaCard.alpha = 1;
        this.piccoloCard.alpha = 0.5;
    }

    _selectPiccolo() {
        this.gokuCard.alpha = 0.5;
        this.vegetaCard.alpha = 0.5;
        this.piccoloCard.alpha = 1;
    }
}
