import Goku from '../models/characters/Goku';
import Vegeta from '../models/characters/Vegeta';

class MenuState extends Phaser.State {
    preload() {
        console.log('MenuState#preload');
        this.load.image('bg-menu', './assets/graphics/backgrounds/bg-menu.jpg');
        this.load.image('goku-card', './assets/graphics/characters/goku/goku-card.jpg');
        this.load.image('vegeta-card', './assets/graphics/characters/vegeta/vegeta-card.jpg');
    }

    create() {
        console.log('MenuState#create');
        this.add.image(0, 0, 'bg-menu');

        this.add.button(200, 130, 'goku-card', this._selectGoku);
        this.add.button(400, 130, 'vegeta-card', this._selectVegeta);
    }

    _selectGoku() {
        this.player = new Goku({
            name: 'Son Gokū'
        });
        this.state.start('Searching');
    }

    _selectVegeta() {
        this.player = new Vegeta({
            name: 'Vegeta'
        });
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
