const COLLECT = require('../../constants/collect');
let utils = require('../../helpers/utils');

let { addLabel } = require('../../helpers/message');

const TILE = 40;
// Size of one pixel of the darkness.
const FOG_PIXEL = 5;
// The dragon balls in the corner: dim until found, 50 pixels apart.
const HUD_BALL_GAP = 50;
const HUD_BALL_DIM = 0.3;
// Frames of the small head: standing and four steps of a walk.
const MINI_FRAMES = {
    standing: { right: 0, left: 5 },
    walk: { right: [1, 2, 3, 4], left: [6, 7, 8, 9] }
};
const GRASS_COLOR = '#5cb531';
const DEFAULT_COLOR = '#000';

export default class CollectDragonBallsState extends Phaser.State {
    layer = null;
    emitter = null;

    create() {
        let random = utils.random(1, COLLECT.MAPS);

        // Grass, visible where the map has no tile.
        this.stage.backgroundColor = GRASS_COLOR;

        this._setupWorld(random);
        this._setupBalls(random);
        this._setupSprite(10, 60, this.game.player);
        this._setupParticles();
        this._setupFog();

        this._setupTimer();
        this._setupHud();
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
        // The head of the character, made for the maze.
        character.createSprite(this, x, y, `${character.id}-mini`);

        let $sprite = character.getSprite();
        $sprite.anchor.setTo(...anchor);
        $sprite.smoothed = false;

        // Tutaj tworzymy ciało dla naszej postaci.
        this.physics.arcade.enable($sprite);

        $sprite.body.collideWorldBounds = true;

        // The head collides, a bit smaller than it looks.
        $sprite.body.setSize(30, 26, 15, 25);
        $sprite.facing = 'right';
        $sprite.frame = MINI_FRAMES.standing.right;

        ['right', 'left'].forEach((facing) => {
            $sprite.animations.add(`walk-${facing}`, MINI_FRAMES.walk[facing], 8, true);
        });
    }

    _setupBalls(random) {
        let balls = this.game.balls = this.add.group();
        balls.enableBody = true;
        this.physics.arcade.enable(balls);

        let places = this.cache.getJSON(`positions-${random}`);
        // Every ball has its number of stars, in a random place.
        let stars = Phaser.ArrayUtils.shuffle(places.map((place, index) => index + 1));

        places.forEach(([x, y], index) => {
            // Small balls in the middle of their tiles: harder to spot.
            let $ball = balls.create(x * TILE + TILE / 2, y * TILE + TILE / 2, 'ball-spritesheet');
            $ball.anchor.setTo(0.5, 0.5);
            $ball.smoothed = false;
            $ball.animations.add('default', [0, 1, 2, 3], 4, true).play();
            $ball.stars = stars[index];
        });
    }

    /**
     * Seven dim dragon balls in the corner; a found one lights up.
     */
    _setupHud() {
        let count = this.game.balls.length;
        let right = this.game.width - 12;

        this.hudBalls = [];

        for (let stars = 1; stars <= count; stars++) {
            let x = right - (count - stars) * HUD_BALL_GAP - 22;
            let $ball = this.add.image(x, 34, 'star-balls-spritesheet', stars - 1);

            $ball.anchor.setTo(0.5, 0.5);
            $ball.smoothed = false;
            $ball.fixedToCamera = true;
            $ball.alpha = HUD_BALL_DIM;
            this.hudBalls.push($ball);
        }
    }

    /**
     * The ball with the given stars lights up, jumps and blinks.
     */
    _lightHudBall(stars) {
        let $ball = this.hudBalls[stars - 1];

        if (!$ball) {
            return;
        }

        $ball.alpha = 1;

        let y = $ball.cameraOffset.y;
        this.add.tween($ball.cameraOffset).to({ y: y - 12 }, 160, Phaser.Easing.Quadratic.Out, true, 0, 0, true);

        let blink = this.add.tween($ball).to({ alpha: 0.4 }, 90, Phaser.Easing.Linear.None, true, 320, 2, true);
        blink.onComplete.add(() => {
            $ball.alpha = 1;
        });

        this._fireParticles($ball.cameraOffset.x + this.camera.x, y + this.camera.y);
    }

    _setupTimer() {
        let limit = COLLECT.MAPS_TIME_LIMIT;
        let ending = parseInt(Math.log2(limit));
        this.remain = limit;

        let $message = addLabel(this.game, 12, 12, `${this.game.locale.TIME}: ${limit}`, [0, 0]);

        this.time.events.repeat(Phaser.Timer.SECOND, limit, () => {
            this.remain--;
            let remain = this.remain;
            $message.setText(`${this.game.locale.TIME}: ${remain}`);

            if (remain === ending) {
                $message.anchor.setTo(0.5, 0.5);
                $message.x = this.game.width / 2;
                $message.y = this.game.height / 2;
                $message.fill = '#f00';
            }

            if (remain === 0) {
                this.game.emit('game:collect-failed');
            }
        });
    }

    shutdown() {
        this.stage.backgroundColor = DEFAULT_COLOR;
    }

    /**
     * Darkness over the map: only a circle around the player is visible.
     * It is drawn on a small canvas and enlarged, so its edge is pixelated.
     */
    _setupFog() {
        this.fog = this.add.bitmapData(this.game.width / FOG_PIXEL, this.game.height / FOG_PIXEL);

        let $fog = this.add.image(0, 0, this.fog);
        $fog.scale.setTo(FOG_PIXEL, FOG_PIXEL);
        $fog.smoothed = false;
    }

    _updateFog() {
        let $player = this.game.player.getSprite();
        let x = $player.x / FOG_PIXEL;
        let y = $player.y / FOG_PIXEL;
        let radius = COLLECT.SIGHT / FOG_PIXEL;
        let context = this.fog.ctx;
        let light = context.createRadialGradient(x, y, radius * 0.55, x, y, radius);

        light.addColorStop(0, 'rgba(0, 0, 0, 1)');
        light.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.fog.clear();
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = 'rgba(6, 8, 18, 0.97)';
        context.fillRect(0, 0, this.fog.width, this.fog.height);
        context.globalCompositeOperation = 'destination-out';
        context.fillStyle = light;
        context.fillRect(0, 0, this.fog.width, this.fog.height);
        context.globalCompositeOperation = 'source-over';
        this.fog.dirty = true;
    }

    update() {
        this._updateFog();
        this._handleCollision();
        this._handleKeyboard();
    }

    _handleCollision() {
        let $player = this.game.player.getSprite();

        this.physics.arcade.collide($player, this.layer);
        this.physics.arcade.collide($player, this.game.balls, this._handleCollectedBall.bind(this));
    }

    _handleCollectedBall(player, $ball) {
        this._fireParticles($ball.x, $ball.y);

        $ball.destroy();
        this._lightHudBall($ball.stars);

        if (this.game.balls.length === 0) {
            this.game.emit('game:collect-completed', {
                summary: [
                    { label: 'time', value: `${COLLECT.MAPS_TIME_LIMIT - this.remain} s` },
                    { label: 'balls', value: '7 / 7' }
                ]
            });
        }
    }

    _handleKeyboard() {
        let $player = this.game.player.getSprite();
        let keyboard = this.input.keyboard;

        // Resetujemy, aby velocity (prędkość) ciągle nie rosła.
        $player.body.velocity.x = $player.body.velocity.y = 0;

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            $player.body.velocity.x -= COLLECT.PLAYER_SPEED;
            $player.facing = 'left';
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            $player.body.velocity.x += COLLECT.PLAYER_SPEED;
            $player.facing = 'right';
        }

        if (keyboard.isDown(Phaser.Keyboard.UP)) {
            $player.body.velocity.y -= COLLECT.PLAYER_SPEED;
        } else if (keyboard.isDown(Phaser.Keyboard.DOWN)) {
            $player.body.velocity.y += COLLECT.PLAYER_SPEED;
        }

        // Walking (also up and down) or standing, looking where it went last.
        let isMoving = $player.body.velocity.x !== 0 || $player.body.velocity.y !== 0;

        if (isMoving) {
            $player.play(`walk-${$player.facing}`);
        } else {
            $player.animations.stop();
            $player.frame = MINI_FRAMES.standing[$player.facing];
        }
    }

    render() {
        let $player = this.game.player.getSprite();
        // this.game.debug.bodyInfo($player, 25, 25);
        // this.game.debug.body($player);
    }
}
