class SearchingState extends Phaser.State {
    preload() {
        this.load.image('bg-searching', './assets/graphics/backgrounds/bg-searching.jpg');
    }

    create() {
        this.add.image(0, 0, 'bg-searching');
        this.add.text(50, 50, `Hello ${this.game.player.name}`);
    }

    update() {

    }

    render() {

    }
}

export default SearchingState;
