import Configuration from '../configuration';
import AbstractState from './AbstractState';

class SearchingState extends AbstractState {
    layer = null;
    sound = {
        candypop: null
    };

    preload() {
        super.preload();

        this.load.spritesheet('spr-searching', './assets/graphics/spritesheet/spr-searching.jpg', 40, 40);

        this.load.tilemap('searching-1', './assets/maps/searching-1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('searching-2', './assets/maps/searching-2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('searching-3', './assets/maps/searching-3.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.json('place-1', './assets/balls/place-1.json');
        this.load.json('place-2', './assets/balls/place-2.json');
        this.load.json('place-3', './assets/balls/place-3.json');

        this.load.image('goku-searching', './assets/graphics/characters/goku/goku-searching.png');
        this.load.image('vegeta-searching', './assets/graphics/characters/vegeta/vegeta-searching.png');

        this.load.audio('sound-candypop', './assets/sound/dbz/candypop.ogg');
    }

    create() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.sound.candypop = this.add.audio('sound-candypop');

        let map = this.add.tilemap('searching-1');
        map.addTilesetImage('spr-searching');
        map.setCollisionByIndex(1);

        this.layer = map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();

        this._setupBalls();
        this._setupPlayerSprite();
        this._showWelcomeMessage();

        this._setupTimer();

        this.loadSoundPreferences();
    }

    _setupPlayerSprite() {
        let player = this.game.player.phaser = this.add.sprite(30, 50, `${this.game.player.id}-searching`);
        player.anchor.setTo(0.5, 0.5);

        this.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.setSize(30, 30, 0, 10);
    }

    _setupBalls() {
        let balls = this.game.balls = this.add.group();
        balls.enableBody = true;
        this.physics.arcade.enable(balls);

        let places = this.cache.getJSON('place-1');
        places.forEach((item) => {
            let [x, y] = item;
            balls.add(this.add.tileSprite(x * 40, y * 40, 40, 40, 'spr-searching', 1));
        });
    }

    _showWelcomeMessage() {
        let message = this.add.text(this.game.width / 2, this.game.height / 2, `Hello ${this.game.player.nickname} (${this.game.player.name})`);
        message.alpha = 0;
        message.fontSize = 60;
        message.fill = '#fff';
        message.anchor.set(0.5, 0.5);
        message.setShadow(0, 0, 'rgba(0,0,0,0.5)', 10);

        this.add.tween(message).to({ alpha: 1 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);

        this.time.events.add(Phaser.Timer.SECOND * 1.5, this._hideWelcomeMessage, this, message);
    }

    _hideWelcomeMessage(message) {
        this.add.tween(message).to({ alpha: 0 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.None, true);
    }

    _setupTimer() {
        let [limit] = Configuration.SEARCHING_MAPS_TIME_LIMIT;
        let ending = parseInt(Math.log2(limit));
        let clock = this.time.create();
        let message = this.add.text(10, 10, `Time: ${limit}`);
        message.fill = '#fff';
        message.setShadow(0, 0, 'rgba(0,0,0,0.5)', 3);

        clock.repeat(Phaser.Timer.SECOND, limit, () => {
            let remain = limit - parseInt(clock.seconds);
            message.setText(`Time: ${remain}`);

            if (remain === ending) {
                message.anchor.setTo(0.5, 0.5);
                message.x = this.game.width / 2;
                message.y = this.game.height / 2;
                message.fill = '#f00';
                message.fontSize = 60;
            }
        }, this);

        clock.onComplete.add(() => {
            this.state.start('GameOver');
        });

        clock.start();
    }

    update() {
        this._handleCollision();
        this._handleKeyboard();
    }

    _handleCollision() {
        this.physics.arcade.collide(this.game.player.phaser, this.layer);
        this.physics.arcade.collide(this.game.player.phaser, this.game.balls, (player, ball) => {
            ball.destroy();

            this.sound.candypop.play();

            if (this.game.balls.length === 0) {
                this.state.start('Shenron');
            }
        });
    }

    _handleKeyboard() {
        let player = this.game.player.phaser;
        let keyboard = this.input.keyboard;

        player.body.velocity.x = player.body.velocity.y = 0;

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            player.body.velocity.x -= Configuration.SEARCHING_PLAYER_SPEED;
            player.angle = -10;
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            player.body.velocity.x += Configuration.SEARCHING_PLAYER_SPEED;
            player.angle = 10;
        } else {
            player.angle = 0;
        }

        if (keyboard.isDown(Phaser.Keyboard.UP)) {
            player.body.velocity.y -= Configuration.SEARCHING_PLAYER_SPEED;
        } else if (keyboard.isDown(Phaser.Keyboard.DOWN)) {
            player.body.velocity.y += Configuration.SEARCHING_PLAYER_SPEED;
        }
    }

    render() {
        // let player = this.game.player.phaser;
        // this.game.debug.bodyInfo(player, 25, 25);
        // this.game.debug.body(player);
    }
}

export default SearchingState;
