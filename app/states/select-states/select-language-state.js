let isObject = require('lodash.isobject');
let assert = require('assert');
let utils = require('../../helpers/utils');
let { displayFullscreenMessage } = require('../../helpers/message');

export default class SelectLanguageState extends Phaser.State {
    plCard = null;
    enCard = null;
    onEnter = null;

    create() {
        this.enCard = this.add.button(150, 150, 'btn-en', this._chooseEnglish, this);
        this.enCard.onInputOver.add(this._selectEnglish, this);

        this.plCard = this.add.button(450, 150, 'btn-pl', this._choosePolish, this);
        this.plCard.onInputOver.add(this._selectPolish, this);

        this._setupKeyboard();
        // Domyślnie wybieramy język angielski.
        this._selectEnglish();
    }

    _choosePolish() {
        this._chooseLanguage('locale-pl');
    }

    _chooseEnglish() {
        this._chooseLanguage('locale-en');
    }

    _chooseLanguage(locale) {
        if (this.game.locale) {
            // Jeśli wybraliśmy już język, to ignorujemy kolejne wybory.
            return;
        }

        this.game.locale = this.cache.getJSON(locale);

        assert(isObject(this.game.locale));

        this.game.emit('locale:select', { locale: locale });

        displayFullscreenMessage(this.game, this.game.locale.CONTROLS_INFO);

        utils.timeout(this, Phaser.Timer.SECOND * 2, () => {
            this.game.emit('game:language-selected');
        });
    }

    _setupKeyboard() {
        let left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        let right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        let enter = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        // Wstrzymujemy propagację zdarzeń w oknie przeglądarki.
        this.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.ENTER
        ]);

        left.onDown.add(() => this._selectPolish());
        right.onDown.add(() => this._selectEnglish());
        enter.onDown.addOnce(() => this.onEnter());
    }

    _selectPolish() {
        this.plCard.alpha = 1;
        this.enCard.alpha = 0.5;
        this.onEnter = this._choosePolish;
    }

    _selectEnglish() {
        this.plCard.alpha = 0.5;
        this.enCard.alpha = 1;
        this.onEnter = this._chooseEnglish;
    }
}
