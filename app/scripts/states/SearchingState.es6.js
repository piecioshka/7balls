import Configuration from '../configuration';

class SearchingState extends Phaser.State {
    preload() {
        // this.load.image('bg-searching', './assets/graphics/backgrounds/bg-searching.jpg');
        this.load.spritesheet('spr-searching', './assets/graphics/spritesheet/spr-searching.jpg', 40, 40);

        this.load.tilemap('searching-1', './assets/maps/searching-1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('searching-2', './assets/maps/searching-2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('searching-3', './assets/maps/searching-3.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.json('place-1', './assets/balls/place-1.json');
        this.load.json('place-2', './assets/balls/place-2.json');
        this.load.json('place-3', './assets/balls/place-3.json');

        this.load.image('goku-searching', './assets/graphics/characters/goku/goku-searching.png');
        this.load.image('vegeta-searching', './assets/graphics/characters/vegeta/vegeta-searching.png');
    }

    create() {
        // this.add.image(0, 0, 'bg-searching');

        let map = this.add.tilemap('searching-1');
        map.addTilesetImage('spr-searching');

        let layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();

        this._setupPlayerSprite();
        this._setupBalls();
        this._showWelcomeMessage();
    }

    _setupPlayerSprite() {
        this.game.player.sprite = this.add.sprite(10, 50, `${this.game.player.id}-searching`);
        this.game.player.sprite.anchor.setTo(0.5, 0.5);
    }

    _setupBalls() {
        this.game.balls = this.add.group();

        let places = this.cache.getJSON('place-1');
        places.forEach((item) => {
            let [x, y] = item;
            this.game.balls.add(this.add.tileSprite(x * 40, y * 40, 40, 40, 'spr-searching', 1));
        });
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
        let player = this.game.player.sprite;
        let keyboard = this.input.keyboard;

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            player.x -= Configuration.PLAYER_SPEED;
            player.angle = -10;
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            player.x += Configuration.PLAYER_SPEED;
            player.angle = 10;
        } else {
            player.angle = 0;
        }

        if (keyboard.isDown(Phaser.Keyboard.UP)) {
            player.y -= Configuration.PLAYER_SPEED;
        } else if (keyboard.isDown(Phaser.Keyboard.DOWN)) {
            player.y += Configuration.PLAYER_SPEED;
        }
    }

    render() {

    }
}

export default SearchingState;
