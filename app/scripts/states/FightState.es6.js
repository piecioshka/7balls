import Configuration from '../configuration';
import Freeza from '../models/characters/Freeza';
import Cell from '../models/characters/Cell';
import Bubu from '../models/characters/Bubu';

class FightState extends Phaser.State {
    enemies = [Freeza, Cell, Bubu];
    keyboard = {
        x: null,
        c: null,
        up: null,
        space: null
    };
    sound = {
        jump: null,
        weakkick: null,
        weakpunch: null
    };

    preload() {
        this.load.image('bg-fight-hell', './assets/graphics/backgrounds/bg-fight-hell.png');
        this.load.image('bg-fight-sky', './assets/graphics/backgrounds/bg-fight-sky.png');

        this.load.spritesheet('goku-spritesheet', './assets/graphics/characters/goku/goku-fight.png', 150, 200);
        this.load.spritesheet('vegeta-spritesheet', './assets/graphics/characters/vegeta/vegeta-fight.png', 150, 200);

        this.load.spritesheet('freeza-spritesheet', './assets/graphics/characters/freeza/freeza-fight.png', 150, 200);
        this.load.spritesheet('cell-spritesheet', './assets/graphics/characters/cell/cell-fight.png', 150, 200);
        this.load.spritesheet('bubu-spritesheet', './assets/graphics/characters/bubu/bubu-fight.png', 150, 200);

        this.load.audio('sound-jump', './assets/sound/dbz/jump.ogg');

        this.load.audio('sound-weakkick', './assets/sound/dbz/weakkick.ogg');
        this.load.audio('sound-weakpunch', './assets/sound/dbz/weakpunch.ogg');

        this.load.audio('sound-mediumkick', './assets/sound/dbz/mediumkick.ogg');
        this.load.audio('sound-mediumpunch', './assets/sound/dbz/mediumpunch.ogg');

        this.load.audio('sound-strongkick', './assets/sound/dbz/strongkick.ogg');
        this.load.audio('sound-superpunch', './assets/sound/dbz/strongpunch.ogg');
    }

    create() {
        this.add.image(0, 0, 'bg-fight-sky');

        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.set(0, Configuration.FIGHT_GRAVITY);
        this.world.setBounds(0, 0, this.game.width, this.game.height - 40);

        this.sound.jump = this.add.audio('sound-jump');
        this.sound.weakkick = this.add.audio('sound-weakkick');
        this.sound.weakpunch = this.add.audio('sound-weakpunch');

        this._setupEnemy();

        this._setupPlayerSprite();
        this._setupEnemySprite();

        this._setupKeyboard();
    }

    _setupEnemy() {
        // Random enemy from predefined list.
        let Character = this._randomEnemy();

        // Add player object as common in all states.
        this.game.enemy = new Character();

        console.log('Random character: ', this.game.enemy.name);
    }

    _setupPlayerSprite() {
        let player = this.game.player.phaser = this.add.sprite(150, 360, `${this.game.player.id}-spritesheet`);
        player.anchor.setTo(0, 1);
        this._defineDefaultProperties(player);
        FightState._defineAnimations(player, this.game.player.name);
    }

    _setupEnemySprite() {
        let enemy = this.game.enemy.phaser = this.add.sprite(650, 360, `${this.game.enemy.id}-spritesheet`);
        enemy.anchor.setTo(1, 1);
        this._defineDefaultProperties(enemy);
        FightState._defineAnimations(enemy, this.game.enemy.name);
    }

    _setupKeyboard() {
        let player = this.game.player.phaser;

        this.keyboard.c = this.input.keyboard.addKey(Phaser.Keyboard.C);
        this.keyboard.x = this.input.keyboard.addKey(Phaser.Keyboard.X);
        this.keyboard.up = this.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.keyboard.space = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  Stop the following keys from propagating up to the browser
        this.input.keyboard.addKeyCapture([
            Phaser.Keyboard.C,
            Phaser.Keyboard.X,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.SPACEBAR
        ]);

        this.keyboard.c.onDown.add(() => {
            player.play('kicking');
            this.sound.weakkick.play();
            console.log('Character "%s" is KICKING', this.game.player.name);
        });

        this.keyboard.x.onDown.add(() => {
            player.play('boxing');
            this.sound.weakpunch.play();
            console.log('Character "%s" is BOXING', this.game.player.name);
        });

        let handleJump = () => {
            if (player.body.onFloor()) {
                player.body.velocity.y -= Configuration.FIGHT_PLAYER_JUMP;
                player.play('jumping');
                console.log('Character "%s" is JUMPING', this.game.player.name);
                this.sound.jump.play();
            }
        };

        this.keyboard.up.onDown.add(handleJump);
        this.keyboard.space.onDown.add(handleJump);
    }

    _randomEnemy() {
        let randomNumber = parseInt(Math.random() * 3);
        return this.enemies[randomNumber];
    }

    _defineDefaultProperties(character) {
        this.physics.arcade.enable(character);
        character.body.bounce.setTo(0, 0.1);
        character.body.collideWorldBounds = true;
        character.body.setSize(100, 200, 0, 0);
    }

    static _defineAnimations(character, name) {
        let resizeMaximum = () => {
            character.body.setSize(150, 200, 0, 0);
        };
        let reduceByHalf = () => {
            character.body.setSize(150, 100, 0, 0);
        };
        let revertDefaultSize = () => {
            character.body.setSize(100, 200, 0, 0);
        };

        let sitting = character.animations.add('sitting', [4, 5], 4, false);
        sitting.onStart.add(reduceByHalf);
        sitting.onComplete.add(revertDefaultSize);

        let kicking = character.animations.add('kicking', [12, 13], 16, false);
        kicking.onStart.add(resizeMaximum);
        kicking.onComplete.add(revertDefaultSize);

        let boxing = character.animations.add('boxing', [16, 17], 16, false);
        boxing.onStart.add(resizeMaximum);
        boxing.onComplete.add(revertDefaultSize);

        character.animations.add('standing', [0, 1, 2], 4, true);
        character.animations.add('jumping', [8, 9], 4, false);
        character.animations.add('win', [20, 21], 4, false);
        character.animations.add('died', [24, 25], 4, false);

        character.play('standing');
        console.log('Character "%s" is STANDING', name);
    }

    update() {
        this._handleCollision();
        this._handleKeyboard();
    }

    _handleCollision() {
        this.physics.arcade.collide(this.game.player.phaser, this.game.enemy.phaser, (player, enemy) => {
            player.play('win');
            console.log('Character "%s" is WIN', this.game.player.name);

            enemy.play('died');
            console.log('Character "%s" is DIED', this.game.enemy.name);
        });
    }

    _handleKeyboard() {
        let player = this.game.player.phaser;
        let keyboard = this.input.keyboard;

        player.body.velocity.x = 0;
        player.body.velocity.y += 7;

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            player.body.velocity.x -= Configuration.FIGHT_PLAYER_SPEED;
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            player.body.velocity.x += Configuration.FIGHT_PLAYER_SPEED;
        }

        if (keyboard.isDown(Phaser.Keyboard.DOWN)) {
            player.play('sitting');
            console.log('Character "%s" is SITTING', this.game.player.name);
        }
    }

    render() {
        // let player = this.game.player.phaser;
        // this.game.debug.bodyInfo(player, 25, 25);
        // this.game.debug.body(player);

        // let enemy = this.game.enemy.phaser;
        // this.game.debug.bodyInfo(enemy, 25, 225);
        // this.game.debug.body(enemy);
    }
}

export default FightState;
