import AbstractState from './AbstractState';

class LanguageState extends AbstractState {
    plCard = null;
    enCard = null;
    onEnter = null;

    preload() {
        super.preload();

        this.load.json('locale-en', './locale/en_EN.json');
        this.load.json('locale-pl', './locale/pl_PL.json');

        this.load.image('bg-language', './assets/graphics/backgrounds/bg-language.png');
        this.load.image('btn-pl', './assets/graphics/buttons/pl-flag.png');
        this.load.image('btn-en', './assets/graphics/buttons/usa-flag.png');
    }

    create() {
        this.add.image(0, 0, 'bg-language');

        this.plCard = this.add.button(150, 135, 'btn-pl', this._choosePolish, this);
        this.plCard.events.onInputOver.add(this._selectPolish, this);

        this.enCard = this.add.button(450, 135, 'btn-en', this._chooseEnglish, this);
        this.enCard.events.onInputOver.add(this._selectEnglish, this);

        // Default: select english language.
        this._selectEnglish();

        this.loadSoundPreferences();
    }

    _choosePolish() {
        this.game.locale = this.cache.getJSON('locale-pl');
        this._next();
    }

    _chooseEnglish() {
        this.game.locale = this.cache.getJSON('locale-en');
        this._next();
    }

    _next() {
        this.state.start('Message', true, false, {
            body: this.game.locale.MESSAGE_STATE_WELCOME,
            lifetime: Phaser.Timer.SECOND * 2,
            callback: () => {
                this.game.state.start('Menu');
            }
        });
    }

    update() {
        this._handleKeyboard();
    }

    _handleKeyboard() {
        let keyboard = this.input.keyboard;

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this._selectPolish();
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this._selectEnglish();
        } else if (keyboard.isDown(Phaser.Keyboard.ENTER)) {
            this.onEnter();
        }
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

export default LanguageState;
