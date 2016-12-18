const COLLECT = require('../../constants/collect');
let utils = require('../../helpers/utils');

let { displayFullscreenMessage, addSaiyanLabel } = require('../../helpers/message');

export default class CollectDragonBallsState extends Phaser.State {
    layer = null;
    emitter = null;

    create() {
        let random = utils.random(1, 3);

        this._setupWorld(random);
        this._setupBalls(random);
        this._setupSprite(10, 60, this.game.player);
        this._setupParticles();

        this._setupTimer();

        displayFullscreenMessage(this.game, this.game.locale.COLLECT_DRAGON_BALLS);
    }

    _setupParticles() {
        this.emitter = this.add.emitter();
        this.emitter.makeParticles('pixel');
        this.emitter.setXSpeed(-150, 150);
        this.emitter.gravity = 0;
    }

    _fireParticles(x, y) {
        this.emitter.x = x;
        this.emitter.y = y;
        this.emitter.start(true, 600, null, 15);
    }

    _setupWorld(random) {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        let map = this.add.tilemap(`map-collecting-${random}`);
        map.addTilesetImage('collect-spritesheet');
        map.setCollision([1, 3]);

        this.layer = map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
    }

    _setupSprite(x, y, character, anchor = [0.5, 0.5]) {
        character.createSprite(this, x, y, `${character.id}-collecting`);

        let sprite = character.getSprite();
        sprite.anchor.setTo(...anchor);

        this._defineDefaultProperties(character);
    }

    _defineDefaultProperties(character) {
        let sprite = character.getSprite();

        // Tutaj tworzymy ciało dla naszej postaci.
        this.physics.arcade.enable(sprite);

        sprite.body.collideWorldBounds = true;
        sprite.body.setSize(30, 30, 5, 30);
    }

    _setupBalls(random) {
        let balls = this.game.balls = this.add.group();
        balls.enableBody = true;
        this.physics.arcade.enable(balls);

        let places = this.cache.getJSON(`positions-${random}`);
        places.forEach(([x, y]) => {
            let ball = this.add.tileSprite(x * 40, y * 40, 40, 40, 'ball-spritesheet');

            ball.animations.add('base', [0, 1, 2, 3], 4, true);
            ball.play('base');

            balls.add(ball);
        });
    }

    _setupTimer() {
        let limit = COLLECT.MAPS_TIME_LIMIT;
        let ending = parseInt(Math.log2(limit));
        let clock = this.game.time.create();

        let message = addSaiyanLabel(this.game, 10, 0, `${this.game.locale.TIME}: ${limit}`);
        message.fontSize = 35;

        clock.repeat(Phaser.Timer.SECOND, limit, () => {
            let remain = limit - parseInt(clock.seconds);
            message.setText(`${this.game.locale.TIME}: ${remain}`);

            if (remain === ending) {
                message.anchor.setTo(0.5, 0.5);
                message.x = this.game.width / 2;
                message.y = this.game.height / 2;
                message.fill = '#f00';
                message.fontSize = 100;
            }
        }, this);

        clock.onComplete.add(() => {
            this.game.emit('game:collect-failed');
        });

        clock.start();
    }

    update() {
        this._handleCollision();
        this._handleKeyboard();
    }

    _handleCollision() {
        let playerSprite = this.game.player.getSprite();

        this.physics.arcade.collide(playerSprite, this.layer);
        this.physics.arcade.collide(playerSprite, this.game.balls, this._handleCollectedBall.bind(this));
    }

    _handleCollectedBall(player, ball) {
        this._fireParticles(ball.x + ball.width / 2, ball.y + ball.height / 2);

        // this.game.emit('ball:collected', { player, ball });
        ball.destroy();

        if (this.game.balls.length === 0) {
            this.game.emit('game:collect-completed');
        }
    }

    _handleKeyboard() {
        let playerSprite = this.game.player.getSprite();
        let keyboard = this.input.keyboard;

        playerSprite.body.velocity.x = playerSprite.body.velocity.y = 0;

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            playerSprite.body.velocity.x -= COLLECT.PLAYER_SPEED;
            playerSprite.angle = -10;
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            playerSprite.body.velocity.x += COLLECT.PLAYER_SPEED;
            playerSprite.angle = 10;
        } else {
            playerSprite.angle = 0;
        }

        if (keyboard.isDown(Phaser.Keyboard.UP)) {
            playerSprite.body.velocity.y -= COLLECT.PLAYER_SPEED;
        } else if (keyboard.isDown(Phaser.Keyboard.DOWN)) {
            playerSprite.body.velocity.y += COLLECT.PLAYER_SPEED;
        }
    }

    render() {
        let playerSprite = this.game.player.getSprite();
        // this.game.debug.bodyInfo(playerSprite, 25, 25);
        this.game.debug.body(playerSprite);
    }
}
