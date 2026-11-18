const FLIGHT = require('../../constants/flight');

let { addLabel } = require('../../helpers/message');
let { addBackground } = require('../../helpers/background');
// Small figures of the flight (see scripts/draw-characters.js): on the cloud,
// firing with a stretched arm, and two frames of flying, which Cell Jr. use.
// The first four look to the right, the next four to the left.
const FLYING_FRAME = 0;
const FIRING_FRAME = 1;
const MONSTER_FRAMES = [6, 7];

/**
 * The player flies on a cloud to the next rival and has to avoid monsters
 * coming from the right. Every hit takes some HP, which is not given back
 * before the next fight.
 */
export default class AvoidMonstersState extends Phaser.State {
    isFinished = false;
    hits = 0;
    destroyed = 0;
    isWaveReady = true;
    $wave = null;
    monsters = null;
    clouds = null;
    $cloud = null;
    $hp = null;

    create() {
        this.isFinished = false;
        this.hits = 0;
        this.destroyed = 0;

        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.setTo(0, 0);
        this.world.setBounds(0, 0, this.game.width, this.game.height);

        addBackground(this);
        this._setupClouds();
        this._setupPlayer();

        this.monsters = this.add.group();
        this.monsters.enableBody = true;

        this.$hp = addLabel(this.game, this.game.width - 12, 12, '', [1, 0]);
        this._updateHP();

        this._setupTimer();
        this.time.events.loop(FLIGHT.MONSTER_INTERVAL, this._addMonster, this);
    }

    _setupClouds() {
        this.clouds = this.add.group();

        [[100, 40], [420, 150], [700, 70], [260, 260]].forEach(([x, y]) => {
            this.clouds.create(x, y, 'cloud').alpha = 0.8;
        });
    }

    _setupPlayer() {
        let player = this.game.player;

        // Kinto-un, the small yellow cloud.
        this.$cloud = this.add.image(0, 0, 'kinto');
        this.$cloud.anchor.setTo(0.5, 0.5);

        player.createSprite(this, 120, this.game.height / 2, `${player.id}-flight`);

        let $player = player.getSprite();
        $player.frame = FLYING_FRAME;
        $player.anchor.setTo(0.5, 0.5);

        this.physics.arcade.enable($player);
        $player.body.collideWorldBounds = true;
        // Smaller than the picture, to forgive near misses.
        $player.body.setSize(40, 70, 40, 30);

        this._setupWave();
    }

    /**
     * The energy wave, fired with V: it destroys every Cell Jr. on its way.
     */
    _setupWave() {
        this.$wave = this.add.image(0, 0, 'beam');
        this.$wave.anchor.setTo(0, 0.5);
        this.$wave.visible = false;
        this.isWaveReady = true;

        this.$wave.tint = this.game.player.wave;

        // The same key as in the fights.
        let fire = this.input.keyboard.addKey(Phaser.Keyboard.V);
        this.input.keyboard.addKeyCapture([Phaser.Keyboard.V]);
        fire.onDown.add(this._fireWave, this);
    }

    _fireWave() {
        if (!this.isWaveReady || this.isFinished) {
            return;
        }

        let $player = this.game.player.getSprite();

        this.isWaveReady = false;
        this.$wave.visible = true;
        $player.frame = FIRING_FRAME;
        this.game.music.playSound('wave');

        this.time.events.add(FLIGHT.WAVE_TIME, () => {
            this.$wave.visible = false;
            $player.frame = FLYING_FRAME;
        });

        this.time.events.add(FLIGHT.WAVE_COOLDOWN, () => {
            this.isWaveReady = true;
        });
    }

    _handleWave($player) {
        if (!this.$wave.visible) {
            return;
        }

        this.$wave.x = $player.x + 44;
        this.$wave.y = $player.y - 8;

        this.monsters.children.slice().forEach(($monster) => {
            let isOnTheWay = $monster.x > this.$wave.x && Math.abs($monster.y - this.$wave.y) < FLIGHT.WAVE_REACH;

            if (isOnTheWay) {
                $monster.destroy();
                this.destroyed++;
                this.game.music.playSound('hit');
            }
        });
    }

    _setupTimer() {
        let remain = FLIGHT.TIME;
        let $time = addLabel(this.game, 12, 12, `${this.game.locale.TIME}: ${remain}`, [0, 0]);

        this.time.events.repeat(Phaser.Timer.SECOND, FLIGHT.TIME, () => {
            remain--;
            $time.setText(`${this.game.locale.TIME}: ${remain}`);

            if (remain === 0 && !this.isFinished) {
                this.isFinished = true;
                this.game.emit('game:flight-completed', {
                    summary: [
                        { label: 'hits', value: String(this.hits) },
                        { label: 'destroyed', value: String(this.destroyed) }
                    ]
                });
            }
        });
    }

    _addMonster() {
        if (this.isFinished) {
            return;
        }

        let y = this.rnd.between(50, this.game.height - 50);
        let $monster = this.monsters.create(this.game.width + 60, y, 'cell-jr-flight', MONSTER_FRAMES[0]);

        $monster.anchor.setTo(0.5, 0.5);
        $monster.body.velocity.x = -this.rnd.between(FLIGHT.MONSTER_MIN_SPEED, FLIGHT.MONSTER_MAX_SPEED);
        $monster.smoothed = false;
        $monster.animations.add('fly', MONSTER_FRAMES, 6, true).play();
        $monster.body.setSize(70, 36, 25, 60);
        $monster.checkWorldBounds = true;
        $monster.events.onOutOfBounds.add(() => {
            if ($monster.x < 0) {
                $monster.destroy();
            }
        });
    }

    _updateHP() {
        this.$hp.setText(`HP: ${this.game.player.hp}`);
    }

    _handleHit($player, $monster) {
        let player = this.game.player;

        $monster.destroy();
        this.camera.flash(0xff0000, 200);
        this.hits++;
        this.game.music.playSound('hurt');

        player.hp = Math.max(0, player.hp - FLIGHT.MONSTER_DAMAGE);
        this._updateHP();

        if (player.hp === 0 && !this.isFinished) {
            this.isFinished = true;
            this.game.emit('game:over', { enemy: null });
        }
    }

    update() {
        let $player = this.game.player.getSprite();

        this.clouds.children.forEach((cloud) => {
            cloud.x -= FLIGHT.CLOUD_SPEED;

            if (cloud.x < -cloud.width) {
                cloud.x = this.game.width;
            }
        });

        this._handleKeyboard($player);

        this.$cloud.x = $player.x;
        this.$cloud.y = $player.y + 58;

        this._handleWave($player);
        this.physics.arcade.overlap($player, this.monsters, this._handleHit, null, this);
    }

    _handleKeyboard($player) {
        let keyboard = this.input.keyboard;

        $player.body.velocity.x = $player.body.velocity.y = 0;

        if (this.isFinished) {
            return;
        }

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            $player.body.velocity.x -= FLIGHT.PLAYER_SPEED;
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            $player.body.velocity.x += FLIGHT.PLAYER_SPEED;
        }

        if (keyboard.isDown(Phaser.Keyboard.UP)) {
            $player.body.velocity.y -= FLIGHT.PLAYER_SPEED;
        } else if (keyboard.isDown(Phaser.Keyboard.DOWN)) {
            $player.body.velocity.y += FLIGHT.PLAYER_SPEED;
        }
    }
}
