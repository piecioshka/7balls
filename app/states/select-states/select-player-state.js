import Player from '../../models/player';

import SonGoku from '../../models/species/saiyans/son-goku';
import Vegeta from '../../models/species/saiyans/vegeta';

import Piccolo from '../../models/species/monsters/piccolo';
import Freeza from '../../models/species/monsters/freeza';
import Cell from '../../models/species/monsters/cell';
import Bubu from '../../models/species/monsters/bubu';

import { addSaiyanLabel } from '../../helpers/message';

export default class SelectPlayerState extends Phaser.State {
    gokuCard = null;
    vegetaCard = null;

    cardsIndex = null;
    cards = null;
    clouds = null;

    create() {
        this.cardsIndex = 0;
        this.cards = [];
        this.game.enemies = [Freeza, Cell, Bubu, Piccolo];

        this.add.image(0, 0, 'bg-select-player');

        this.clouds = this.add.group();
        this.clouds.create(-50, 30, 'cloud');
        this.clouds.create(260, 10, 'cloud');
        this.clouds.create(480, 20, 'cloud');

        this.gokuCard = this.add.button(200, 100, 'son-goku-card', () => this._chooseCharacter(SonGoku));
        this.gokuCard.onInputOver.add(this._selectSonGoku, this);
        this.cards.push(this.gokuCard);

        addSaiyanLabel(this.game, 215, 350, 'Son Gokū').fontSize = 30;

        this.vegetaCard = this.add.button(450, 100, 'vegeta-card', () => this._chooseCharacter(Vegeta));
        this.vegetaCard.onInputOver.add(this._selectVegeta, this);
        this.cards.push(this.vegetaCard);

        addSaiyanLabel(this.game, 485, 350, 'Vegeta').fontSize = 30;

        this._setupKeyboard();
        // Domyślnie wybieramy Son Goku.
        this._selectSonGoku();
    }

    _chooseCharacter(typeClass) {
        // Współdzielimy obiekt playera między stanami w grze.
        this.game.player = new Player();
        this.game.player.setPersonality(typeClass);

        this.game.emit('player:select', { player: this.game.player });
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

        this.clouds.children.forEach((item, index) => {
            item.position.x += (Math.log(index + 2) / 5);

            if (item.position.x > this.game.world.width) {
                item.position.x = -1 * item.width;
            }
        }, this);
    }

    _handleKeyboard() {
        let keyboard = this.input.keyboard;

        if (keyboard.isDown(Phaser.Keyboard.ENTER)) {
            this.cards[this.cardsIndex].onInputUp.dispatch();
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
    }

    _selectVegeta() {
        this.gokuCard.alpha = 0.5;
        this.vegetaCard.alpha = 1;
    }
}
