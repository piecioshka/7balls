class GameOverState {
    preload() {
        this.load.image('bg-game-over', './assets/graphics/backgrounds/bg-game-over.jpg');
    }

    create() {
        this.add.image(0, 0, 'bg-game-over');
    }

    update() {

    }

    render() {

    }
}

export default GameOverState;
