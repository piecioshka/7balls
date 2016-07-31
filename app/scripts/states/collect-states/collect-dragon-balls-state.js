
import Configuration from '../../configuration';
import Utilities from '../../common/utilities';

import { shout, addSaiyanLabel } from '../../helpers/meesage';
import { loadSoundPreferences } from '../../helpers/audio';

export default class CollectDragonBallsState extends Phaser.State {
    layer = null;
    sound = {
        candypop: null,
        radar: null
    };

    create() {
        let random = Utilities.random(1, 3);

        this._setupWorld(random);
        this._setupSound();

        this._setupBalls(random);
        this._setupPlayerSprite();

        shout(this.game, { text: `${this.game.locale.COLLECTING_STATE_WELCOME} ${this.game.player.name}!` });

        this._setupTimer(random);

        loadSoundPreferences(this.game);
    }

    _setupWorld(random) {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        let map = this.add.tilemap(`collecting-${random}`);
        map.addTilesetImage('spr-collecting');
        map.setCollision([1, 3]);

        this.layer = map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
    }

    _setupPlayerSprite() {
        let player = this.game.player;

        player.phaser = this.add.sprite(30, 50, `${player.id}-collecting`);
        player.phaser.anchor.setTo(0.5, 0.5);

        this._defineDefaultProperties(player);
    }

    _defineDefaultProperties(character) {
        this.physics.arcade.enable(character.phaser);

        character.phaser.body.collideWorldBounds = true;
        character.phaser.body.setSize(30, 30, 0, 10);
    }

    _setupBalls(random) {
        let balls = this.game.balls = this.add.group();
        balls.enableBody = true;
        this.physics.arcade.enable(balls);

        let places = this.cache.getJSON(`positions-${random}`);
        places.forEach((item) => {
            let [x, y] = item;
            balls.add(this.add.tileSprite(x * 40, y * 40, 40, 40, 'spr-collecting', 1));
        });
    }

    _setupTimer(random) {
        let limit = Configuration.COLLECTING_MAPS_TIME_LIMIT[random - 1];
        let ending = parseInt(Math.log2(limit));
        let clock = this.game.time.create();

        let message = addSaiyanLabel(this.game, 10, 0, `${this.game.locale.COLLECTING_STATE_TIME}: ${limit}`);
        message.fontSize = 35;

        clock.repeat(Phaser.Timer.SECOND, limit, () => {
            let remain = limit - parseInt(clock.seconds);
            message.setText(`${this.game.locale.COLLECTING_STATE_TIME}: ${remain}`);

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
            player.phaser.body.velocity.x -= Configuration.COLLECTING_PLAYER_SPEED;
            player.phaser.angle = -10;
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            player.phaser.body.velocity.x += Configuration.COLLECTING_PLAYER_SPEED;
            player.phaser.angle = 10;
        } else {
            player.phaser.angle = 0;
        }

        if (keyboard.isDown(Phaser.Keyboard.UP)) {
            player.phaser.body.velocity.y -= Configuration.COLLECTING_PLAYER_SPEED;
        } else if (keyboard.isDown(Phaser.Keyboard.DOWN)) {
            player.phaser.body.velocity.y += Configuration.COLLECTING_PLAYER_SPEED;
        }
    }

    render() {
        // let player = this.game.player;
        // this.game.debug.bodyInfo(player.phaser, 25, 25);
        // this.game.debug.body(player.phaser);
    }
}
