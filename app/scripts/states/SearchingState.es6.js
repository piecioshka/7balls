class SearchingState extends Phaser.State {
    preload() {
        // this.load.image('bg-searching', './assets/graphics/backgrounds/bg-searching.jpg');
        this.load.image('spr-searching', './assets/graphics/spritesheet/spr-searching.jpg');
        this.load.tilemap('searching-1', './assets/maps/searching-1.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.image('goku-searching', './assets/graphics/characters/goku/goku-searching.png');
        this.load.image('vegeta-searching', './assets/graphics/characters/vegeta/vegeta-searching.png');
    }

    create() {
        // this.add.image(0, 0, 'bg-searching');

        let map = this.add.tilemap('searching-1');
        map.addTilesetImage('spr-searching');

        let layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();

        // this.add.image(0, 0, 'bg-searching');
        this.add.text(50, 50, `Hello ${this.game.player.nickname} (${this.game.player.name})`);

        if (this.game.player.exp.length) {
            this.add.text(50, 100, `Your experience: ${this.game.player.exp.join('\n')}`);
        }

        this.game.player.sprite = this.add.sprite(10, 50, `${this.game.player.id}-searching`);
    }

    update() {

    }

    render() {

    }
}

export default SearchingState;
