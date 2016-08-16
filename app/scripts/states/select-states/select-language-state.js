let isObject = require('lodash.isobject');
let assert = require('assert');
let utils = require('../../common/utils');
let { displayGameVersion } = require('../../helpers/message');
let { loadSoundPreferences } = require('../../helpers/audio');

/**
 * @extends Phaser.State
 */
export default class SelectLanguageState extends Phaser.State {
    plCard = null;
    enCard = null;
    onEnter = null;

    audio = {
        scouter: null
    };

    create() {
        this.add.image(0, 0, 'bg-select-language');

        this.plCard = this.add.button(150, 200, 'btn-pl', this._choosePolish, this);
        this.plCard.onInputOver.add(this._selectPolish, this);

        this.enCard = this.add.button(450, 200, 'btn-en', this._chooseEnglish, this);
        this.enCard.onInputOver.add(this._selectEnglish, this);

        // Domyślnie wybieramy język angielski.
        this._selectEnglish();

        this._setupKeyboard();
        this._setupSound();

        displayGameVersion(this.game);
        loadSoundPreferences(this.game);
    }

    _choosePolish() {
        this._chooseLanguage('locale-pl');
    }

    _chooseEnglish() {
        this._chooseLanguage('locale-en');
    }

    _chooseLanguage(locale) {
        this.game.locale = this.cache.getJSON(locale);

        assert(isObject(this.game.locale), 'SelectLanguageState#_chooseLanguage: this.game.locale is not an object');

        this.game.emit('locale:select', { locale: locale });

        this._next();
    }

    _next() {
        this.state.start('Message', true, false, {
            content: this.game.locale.MESSAGE_STATE_WELCOME,
            lifespan: Phaser.Timer.SECOND * 2,
            cb: () => {
                this.game.state.start('SelectPlayer');
            }
        });

        // Dodajemy efekty audio.
        this.audio.scouter.play();
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
        enter.onDown.add(() => this.onEnter());
    }

    _setupSound() {
        this.audio.scouter = this.add.audio('scouter');
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
