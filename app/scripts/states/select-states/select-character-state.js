import Goku from '../../models/characters/goku';
import Vegeta from '../../models/characters/vegeta';
import Piccolo from '../../models/characters/piccolo';

import Freeza from '../../models/characters/freeza';
import Cell from '../../models/characters/cell';
import Bubu from '../../models/characters/bubu';

let { displayGameVersion } = require('../../helpers/message');
let { loadSoundPreferences } = require('../../helpers/audio');

/**
 * @extends Phaser.State
 */
export default class SelectCharacterState extends Phaser.State {
    gokuCard = null;
    vegetaCard = null;
    piccoloCard = null;

    cardsIndex = 0;
    cards = null;

    audio = {
        scouter: null
    };

    init() {
        this.cards = [];
        this.game.enemies = [Freeza, Cell, Bubu];
    }

    create() {
        this.add.image(0, 0, 'bg-menu');

        this.gokuCard = this.add.button(220, 160, 'goku-card', this._chooseGoku, this);
        this.gokuCard.onInputOver.add(this._selectGoku, this);
        this.cards.push(this.gokuCard);

        this.vegetaCard = this.add.button(420, 160, 'vegeta-card', this._chooseVegeta, this);
        this.vegetaCard.onInputOver.add(this._selectVegeta, this);
        this.cards.push(this.vegetaCard);

        this.piccoloCard = this.add.button(520, 160, 'piccolo-card', this._choosePiccolo, this);
        this.piccoloCard.onInputOver.add(this._selectPiccolo, this);
        this.piccoloCard.visible = false;

        this._setupKeyboard();
        this._setupSound();

        // Domyślnie wybieramy Son Goku.
        this._selectGoku();

        displayGameVersion(this.game);
        loadSoundPreferences(this.game);
    }

    _chooseGoku() {
        this._chooseCharacter(new Goku());
    }

    _chooseVegeta() {
        this._chooseCharacter(new Vegeta());
    }

    _choosePiccolo() {
        this._chooseCharacter(new Piccolo());
    }

    _chooseCharacter(character) {
        this.game.emit('player:select', { character: character });

        // Współdzielimy obiekt playera między stanami w grze.
        this.game.player = character;
        this._next();
    }

    _next() {
        this.state.start('PlayerPresentation', true, false, {
            name: `${this.game.player.id}-halo`,
            lifetime: Phaser.Timer.SECOND * 2,
            cb: () => {
                this.state.start('Message', true, false, {
                    body: this.game.locale.MESSAGE_STATE_COLLECT_DRAGON_BALL,
                    lifetime: Phaser.Timer.SECOND * 3,
                    cb: () => {
                        this.state.start('CollectDragonBalls');
                    }
                });
            }
        });

        // Dodajemy efekty audio.
        this.audio.scouter.play();
    }

    _setupSound() {
        this.audio.scouter = this.add.audio('scouter');
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

    _selectGoku() {
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
