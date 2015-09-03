class SearchingState extends Phaser.State {
    preload() {
        // this.load.image('bg-searching', './assets/graphics/backgrounds/bg-searching.jpg');
        this.load.image('spr-searching', './assets/graphics/spritesheet/spr-searching.jpg');
        this.load.tilemap('searching-1', './assets/maps/searching-1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('searching-2', './assets/maps/searching-2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('searching-3', './assets/maps/searching-3.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.image('goku-searching', './assets/graphics/characters/goku/goku-searching.png');
        this.load.image('vegeta-searching', './assets/graphics/characters/vegeta/vegeta-searching.png');
    }

    create() {
        // this.add.image(0, 0, 'bg-searching');

        let map = this.add.tilemap('searching-1');
        map.addTilesetImage('spr-searching');

        let layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();

        this._showWelcomeMessage();

        this.game.player.sprite = this.add.sprite(10, 50, `${this.game.player.id}-searching`);
    }

    _showWelcomeMessage() {
        this.welcomeMessage = this.add.text(this.game.width / 2, this.game.height / 2, `Hello ${this.game.player.nickname} (${this.game.player.name})`);
        this.welcomeMessage.alpha = 0;
        this.welcomeMessage.anchor.set(0.5, 0.5);
        this.welcomeMessage.fontSize = 60;
        this.welcomeMessage.fill = '#fff';
        this.welcomeMessage.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

        this.add.tween(this.welcomeMessage).to({ alpha: 1 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);

        this.time.events.add(Phaser.Timer.SECOND * 1.5, this._hideWelcomeMessage, this);
    }

    _hideWelcomeMessage() {
        this.add.tween(this.welcomeMessage).to({ alpha: 0 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
    }

    update() {

    }

    render() {

    }
}

export default SearchingState;
