import Goku from '../models/characters/Goku';
import Vegeta from '../models/characters/Vegeta';

class MenuState extends Phaser.State {
    preload() {
        this.load.image('bg-menu', './assets/graphics/backgrounds/bg-menu.jpg');
        this.load.image('goku-card', './assets/graphics/characters/goku/goku-card.jpg');
        this.load.image('vegeta-card', './assets/graphics/characters/vegeta/vegeta-card.jpg');
    }

    create() {
        this.add.image(0, 0, 'bg-menu');

        this.add.button(200, 130, 'goku-card', this._selectGoku.bind(this));
        this.add.button(400, 130, 'vegeta-card', this._selectVegeta.bind(this));
    }

    _selectGoku() {
        // Add player object as common in all states.
        this.game.player = new Goku({
            exp: ['Kamehameha']
        });

        // Move to next state: Searching
        this.state.start('Searching');
    }

    _selectVegeta() {
        // Add player object as common in all states.
        this.game.player = new Vegeta();

        // Move to next state: Searching
        this.state.start('Searching');
    }

    update() {
        // console.log('MenuState#update');
    }

    render() {
        // console.log('MenuState#render');
    }
}

export default MenuState;
