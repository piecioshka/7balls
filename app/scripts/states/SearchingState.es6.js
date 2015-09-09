import Configuration from '../configuration';
import AbstractState from './AbstractState';

class SearchingState extends AbstractState {
    layer = null;
    sound = {
        candypop: null,
        radar: null
    };

    preload() {
        super.preload();

        this.load.spritesheet('spr-searching', './assets/graphics/spritesheet/spr-searching.png', 40, 40);

        this.load.tilemap('searching-1', './assets/maps/searching-1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('searching-2', './assets/maps/searching-2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('searching-3', './assets/maps/searching-3.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.json('place-1', './assets/balls/place-1.json');
        this.load.json('place-2', './assets/balls/place-2.json');
        this.load.json('place-3', './assets/balls/place-3.json');

        this.load.image('goku-searching', './assets/graphics/characters/goku/goku-searching.png');
        this.load.image('vegeta-searching', './assets/graphics/characters/vegeta/vegeta-searching.png');
        this.load.image('piccolo-searching', './assets/graphics/characters/piccolo/piccolo-searching.png');

        this.load.audio('sound-candypop', './assets/sound/dbz/candypop.ogg');
        this.load.audio('sound-radar', './assets/sound/dbk/devices_02.ogg');
    }

    create() {
        this._setupWorld();
        this._setupSound();

        this._setupBalls();
        this._setupPlayerSprite();

        this.displayCentralMessage({ text: `${this.game.locale.SEARCHING_STATE_WELCOME} ${this.game.player.name}!` });

        this._setupTimer();

        this.loadSoundPreferences();
    }

    _setupWorld() {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        let map = this.add.tilemap('searching-1');
        map.addTilesetImage('spr-searching');
        map.setCollisionByIndex(1);

        this.layer = map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
    }

    _setupPlayerSprite() {
        let player = this.game.player;

        player.phaser = this.add.sprite(30, 50, `${player.id}-searching`);
        player.phaser.anchor.setTo(0.5, 0.5);

        this._defineDefaultProperties(player);
    }

    _defineDefaultProperties(character) {
        this.physics.arcade.enable(character.phaser);

        character.phaser.body.collideWorldBounds = true;
        character.phaser.body.setSize(30, 30, 0, 10);
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

    _setupTimer() {
        let [limit] = Configuration.SEARCHING_MAPS_TIME_LIMIT;
        let ending = parseInt(Math.log2(limit));
        let clock = this.game.time.create();

        let message = this.addSaiyanLabel(10, 0, `${this.game.locale.SEARCHING_STATE_TIME}: ${limit}`);
        message.fontSize = 35;

        clock.repeat(Phaser.Timer.SECOND, limit, () => {
            let remain = limit - parseInt(clock.seconds);
            message.setText(`${this.game.locale.SEARCHING_STATE_TIME}: ${remain}`);

            if (remain === ending) {
                this.sound.radar.play();
                message.anchor.setTo(0.5, 0.5);
                message.x = this.game.width / 2;
                message.y = this.game.height / 2;
                message.fill = '#f00';
                message.fontSize = 60;
            }
        }, this);

        clock.onComplete.add(() => {
            this.sound.radar.stop();
            this.state.start('GameOver');
        });

        clock.start();
    }

    _setupSound() {
        this.sound.candypop = this.add.audio('sound-candypop');
        this.sound.radar = this.add.audio('sound-radar');
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
                this.sound.radar.stop();
                this.state.start('Shenron');
            }
        });
    }

    _handleKeyboard() {
        let player = this.game.player;
        let keyboard = this.input.keyboard;

        player.phaser.body.velocity.x = player.phaser.body.velocity.y = 0;

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            player.phaser.body.velocity.x -= Configuration.SEARCHING_PLAYER_SPEED;
            player.phaser.angle = -10;
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            player.phaser.body.velocity.x += Configuration.SEARCHING_PLAYER_SPEED;
            player.phaser.angle = 10;
        } else {
            player.phaser.angle = 0;
        }

        if (keyboard.isDown(Phaser.Keyboard.UP)) {
            player.phaser.body.velocity.y -= Configuration.SEARCHING_PLAYER_SPEED;
        } else if (keyboard.isDown(Phaser.Keyboard.DOWN)) {
            player.phaser.body.velocity.y += Configuration.SEARCHING_PLAYER_SPEED;
        }
    }

    render() {
        // let player = this.game.player;
        // this.game.debug.bodyInfo(player.phaser, 25, 25);
        // this.game.debug.body(player.phaser);
    }
}

export default SearchingState;
