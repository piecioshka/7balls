import AbstractState from './AbstractState';
import Goku from '../models/characters/Goku';
import Vegeta from '../models/characters/Vegeta';
import Piccolo from '../models/characters/Piccolo';

class MenuState extends AbstractState {
    gokuCard = null;
    vegetaCard = null;
    piccoloCard = null;

    cardsIndex = 0;
    cards = null;

    sound = {
        scouter: null
    };

    init() {
        this.cards = [];
    }

    preload() {
        super.preload();

        this.load.image('bg-menu', './assets/graphics/backgrounds/bg-menu.jpg');

        this.load.image('goku-card', './assets/graphics/characters/goku/goku-card.jpg');
        this.load.image('vegeta-card', './assets/graphics/characters/vegeta/vegeta-card.jpg');
        this.load.image('piccolo-card', './assets/graphics/characters/piccolo/piccolo-card.jpg');

        this.load.audio('scouter', './assets/sound/dbz/scouter.ogg');
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

        // Default: select Son Goku.
        this._selectGoku();

        this.loadSoundPreferences();
    }

    _chooseGoku() {
        // Add player object as common in all states.
        this.game.player = this.game.player || new Goku();
        this._next();
    }

    _chooseVegeta() {
        // Add player object as common in all states.
        this.game.player = this.game.player || new Vegeta();
        this._next();
    }

    _choosePiccolo() {
        // Add player object as common in all states.
        this.game.player = this.game.player || new Piccolo();
        this._next();
    }

    _next() {
        // Move to next state: Searching
        this.state.start('Searching');

        // Add some effect.
        this.sound.scouter.play();
    }

    _setupSound() {
        this.sound.scouter = this.add.audio('scouter');
    }

    _setupKeyboard() {
        let left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        let right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        // Stop the following keys from propagating up to the browser.
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

export default MenuState;
