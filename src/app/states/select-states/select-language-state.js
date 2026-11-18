let isObject = require('lodash.isobject');
let assert = require('assert');
let { addLabel, addTitle } = require('../../helpers/message');

export default class SelectLanguageState extends Phaser.State {
    plCard = null;
    enCard = null;
    onEnter = null;

    create() {
        this.onEnter = null;

        this.enCard = this._addLanguage(250, 'English', this._chooseEnglish, this._selectEnglish);
        this.plCard = this._addLanguage(550, 'Polski', this._choosePolish, this._selectPolish);

        const $hint = addLabel(this.game, this.game.world.centerX, 290, '←  →  Enter', [0.5, 0]);
        $hint.alpha = 0.6;

        this._setupKeyboard();
        // Domyślnie wybieramy język angielski.
        this._selectEnglish();
    }

    /**
     * Languages are written with their own names, so the screen
     * needs no translation.
     */
    _addLanguage(x, name, onChoose, onSelect) {
        const $language = addTitle(this.game, x, 200, name, [0.5, 0.5]);

        $language.inputEnabled = true;
        $language.input.useHandCursor = true;
        $language.events.onInputDown.add(onChoose, this);
        $language.events.onInputOver.add(onSelect, this);

        return $language;
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

        this.game.music.playSound('confirm');
        this.game.locale = this.cache.getJSON(locale);

        assert(isObject(this.game.locale));

        this.game.emit('locale:select', { locale: locale });

        this.game.emit('game:language-selected');
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

        left.onDown.add(() => this._selectEnglish());
        right.onDown.add(() => this._selectPolish());
        enter.onDown.addOnce(() => this.onEnter());
    }

    /**
     * A sound only when the highlighted option really changes, so not for
     * the default one and not for every move of the mouse over it.
     */
    _playSelectSound(nextChoice) {
        if (this.onEnter !== null && this.onEnter !== nextChoice) {
            this.game.music.playSound('select');
        }
    }

    _selectPolish() {
        this._playSelectSound(this._choosePolish);
        this.plCard.alpha = 1;
        this.enCard.alpha = 0.5;
        this.onEnter = this._choosePolish;
    }

    _selectEnglish() {
        this._playSelectSound(this._chooseEnglish);
        this.plCard.alpha = 0.5;
        this.enCard.alpha = 1;
        this.onEnter = this._chooseEnglish;
    }
}
