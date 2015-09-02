class SearchingState extends Phaser.State {
    preload() {
        this.load.image('bg-searching', './assets/graphics/backgrounds/bg-searching.jpg');
    }

    create() {
        this.add.image(0, 0, 'bg-searching');
        this.add.text(50, 50, `Hello ${this.game.player.nickname} (${this.game.player.name})`);

        if (this.game.player.exp.length) {
            this.add.text(50, 100, `Your experience: ${this.game.player.exp.join('\n')}`);
        }
    }

    update() {

    }

    render() {

    }
}

export default SearchingState;
