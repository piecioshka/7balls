let isObject = require('lodash.isobject');
let assert = require('assert');

import { displayVersion } from '../../helpers/meesage';
import { loadSoundPreferences } from '../../helpers/audio';

export default class SelectLanguageState extends Phaser.State {
    plCard = null;
    enCard = null;
    onEnter = null;

    sound = {
        scouter: null
    };

    create() {
        this.add.image(0, 0, 'bg-language');

        this.plCard = this.add.button(150, 135, 'btn-pl', this._choosePolish, this);
        this.plCard.onInputOver.add(this._selectPolish, this);

        this.enCard = this.add.button(450, 135, 'btn-en', this._chooseEnglish, this);
        this.enCard.onInputOver.add(this._selectEnglish, this);

        // Default: select english language.
        this._selectEnglish();

        this._setupKeyboard();
        this._setupSound();

        displayVersion(this.game);
        loadSoundPreferences(this.game);
    }

    _choosePolish() {
        ga('send', 'event', 'game', 'locale-pl');

        this.game.locale = this.cache.getJSON('locale-pl');
        assert(isObject(this.game.locale));

        this._next();
    }

    _chooseEnglish() {
        ga('send', 'event', 'game', 'locale-en');

        this.game.locale = this.cache.getJSON('locale-en');
        assert(isObject(this.game.locale));

        this._next();
    }

    _next() {
        this.state.start('Message', true, false, {
            body: this.game.locale.MESSAGE_STATE_WELCOME,
            lifetime: Phaser.Timer.SECOND * 5,
            cb: () => {
                this.game.state.start('SelectCharacter');
            }
        });

        // Add some audio effect.
        this.sound.scouter.play();
    }

    _setupKeyboard() {
        let left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        let right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        let enter = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        // Stop the following keys from propagating up to the browser.
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
        this.sound.scouter = this.add.audio('scouter');
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
