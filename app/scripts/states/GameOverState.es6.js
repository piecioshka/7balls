import AbstractState from './AbstractState';

class GameOverState extends AbstractState {
    keyboard = {
        enter: null
    };

    preload() {
        super.preload();

        this.load.image('bg-game-over', './assets/graphics/backgrounds/bg-game-over.jpg');
        this.load.image('btn-try-again', './assets/graphics/buttons/try-again.png');
    }

    create() {
        this.loadSoundPreferences();

        this.add.image(0, 0, 'bg-game-over');
        this.add.button(this.game.width / 2 - this.cache.getImage('btn-try-again').width / 2, this.game.height / 2 + 40, 'btn-try-again', this._tryAgain, this);

        this._setupKeyboard();
    }

    _setupKeyboard() {
        this.keyboard.enter = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.keyboard.enter.onDown.add(() => {
            this._tryAgain();
        });
    }

    _tryAgain() {
        this.state.start('Menu');
    }

    update() {

    }

    render() {

    }
}

export default GameOverState;
