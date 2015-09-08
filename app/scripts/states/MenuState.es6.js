import AbstractState from './AbstractState';
import Goku from '../models/characters/Goku';
import Vegeta from '../models/characters/Vegeta';

class MenuState extends AbstractState {
    gokuCard = null;
    vegetaCard = null;
    onEnter = null;
    sound = {
        scouter: null
    };

    preload() {
        super.preload();

        this.load.image('bg-menu', './assets/graphics/backgrounds/bg-menu.jpg');

        this.load.image('goku-card', './assets/graphics/characters/goku/goku-card.jpg');
        this.load.image('vegeta-card', './assets/graphics/characters/vegeta/vegeta-card.jpg');

        this.load.audio('scouter', './assets/sound/dbz/scouter.ogg');
    }

    create() {
        this.loadSoundPreferences();

        this.add.image(0, 0, 'bg-menu');

        this._setupCardGoku();
        this._setupCardVegeta();

        // Default: select Son Goku!
        this._selectGoku();

        this._setupSound();
    }

    _setupCardGoku() {
        this.gokuCard = this.add.button(220, 160, 'goku-card', this._chooseGoku, this);
        this.gokuCard.events.onInputOver.add(this._selectGoku, this);
    }

    _setupCardVegeta() {
        this.vegetaCard = this.add.button(420, 160, 'vegeta-card', this._chooseVegeta, this);
        this.vegetaCard.events.onInputOver.add(this._selectVegeta, this);
    }

    _chooseGoku() {
        // Add player object as common in all states.
        this.game.player = this.game.player || new Goku();
        this._chooseSummary();
    }

    _chooseVegeta() {
        // Add player object as common in all states.
        this.game.player = this.game.player || new Vegeta();
        this._chooseSummary();
    }

    _chooseSummary() {
        // Move to next state: Searching
        this.state.start('Searching');

        // Add some effect.
        this.sound.scouter.play();
    }

    _setupSound() {
        this.sound.scouter = this.add.audio('scouter');
    }

    update() {
        let keyboard = this.input.keyboard;

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this._selectGoku();
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this._selectVegeta();
        } else if (keyboard.isDown(Phaser.Keyboard.ENTER)) {
            this.onEnter();
        }
    }

    _selectGoku() {
        this.gokuCard.alpha = 1;
        this.vegetaCard.alpha = 0.5;
        this.onEnter = this._chooseGoku;
    }

    _selectVegeta() {
        this.gokuCard.alpha = 0.5;
        this.vegetaCard.alpha = 1;
        this.onEnter = this._chooseVegeta;
    }

    render() {
        // console.log('MenuState#render');
    }
}

export default MenuState;
