import AbstractState from './AbstractState';

class GameOverState extends AbstractState {
    preload() {
        super.preload();

        this.load.image('bg-game-over', './assets/graphics/backgrounds/bg-game-over.jpg');
    }

    create() {
        this.add.image(0, 0, 'bg-game-over');

        this.loadSoundPreferences();
    }

    update() {

    }

    render() {

    }
}

export default GameOverState;
