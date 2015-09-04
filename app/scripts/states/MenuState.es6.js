import Goku from '../models/characters/Goku';
import Vegeta from '../models/characters/Vegeta';

class MenuState extends Phaser.State {
    gokuCard = null;
    vegetaCard = null;
    onEnter = null;

    preload() {
        this.load.image('bg-menu', './assets/graphics/backgrounds/bg-menu.jpg');
        this.load.image('goku-card', './assets/graphics/characters/goku/goku-card.jpg');
        this.load.image('vegeta-card', './assets/graphics/characters/vegeta/vegeta-card.jpg');
    }

    create() {
        this.add.image(0, 0, 'bg-menu');

        this.gokuCard = this.add.button(220, 130, 'goku-card', this._chooseGoku.bind(this));
        this.vegetaCard = this.add.button(420, 130, 'vegeta-card', this._chooseVegeta.bind(this));

        this._selectGoku();
    }

    _chooseGoku() {
        // Add player object as common in all states.
        this.game.player = new Goku({
            exp: ['Kamehameha']
        });

        // Move to next state: Searching
        this.state.start('Searching');
    }

    _chooseVegeta() {
        // Add player object as common in all states.
        this.game.player = new Vegeta();

        // Move to next state: Searching
        this.state.start('Searching');
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
        this.onEnter = this._chooseGoku.bind(this);
    }

    _selectVegeta() {
        this.gokuCard.alpha = 0.5;
        this.vegetaCard.alpha = 1;
        this.onEnter = this._chooseVegeta.bind(this);
    }

    render() {
        // console.log('MenuState#render');
    }
}

export default MenuState;
