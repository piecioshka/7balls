import Configuration from '../configuration';
import AbstractState from './AbstractState';
import Freeza from '../models/characters/Freeza';
import Cell from '../models/characters/Cell';
import Bubu from '../models/characters/Bubu';

class FightState extends AbstractState {
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
        weakpunch: null,

        mediumkick: null,
        mediumpunch: null,

        strongkick: null,
        strongpunch: null
    };
    bars = {
        player: {
            hp: null,
            exp: null
        },
        enemy: {
            hp: null,
            exp: null
        }
    };

    preload() {
        super.preload();

        this.load.image('bg-fight-hell', './assets/graphics/backgrounds/bg-fight-hell.png');
        this.load.image('bg-fight-sky', './assets/graphics/backgrounds/bg-fight-sky.png');

        this.load.spritesheet('goku-spritesheet', './assets/graphics/characters/goku/goku-fight.png', 150, 200);
        this.load.spritesheet('vegeta-spritesheet', './assets/graphics/characters/vegeta/vegeta-fight.png', 150, 200);

        this.load.spritesheet('freeza-spritesheet', './assets/graphics/characters/freeza/freeza-fight.png', 150, 200);
        this.load.spritesheet('cell-spritesheet', './assets/graphics/characters/cell/cell-fight.png', 150, 200);
        this.load.spritesheet('bubu-spritesheet', './assets/graphics/characters/bubu/bubu-fight.png', 150, 200);

        this.load.image('freeza-card', './assets/graphics/characters/freeza/freeza-card.jpg');
        this.load.image('cell-card', './assets/graphics/characters/cell/cell-card.jpg');
        this.load.image('bubu-card', './assets/graphics/characters/bubu/bubu-card.jpg');

        this.load.image('bar-blank', './assets/graphics/bars/blank.png');
        this.load.image('bar-exp', './assets/graphics/bars/exp.png');
        this.load.image('bar-exp-invert', './assets/graphics/bars/exp-invert.png');
        this.load.image('bar-hp', './assets/graphics/bars/hp.png');
        this.load.image('bar-hp-invert', './assets/graphics/bars/hp-invert.png');

        this.load.audio('sound-jump', './assets/sound/dbz/jump.ogg');

        // Use this when character has level less than 30.
        this.load.audio('sound-weakkick', './assets/sound/dbz/weakkick.ogg');
        this.load.audio('sound-weakpunch', './assets/sound/dbz/weakpunch.ogg');

        // Use this when character has level less than 60.
        this.load.audio('sound-mediumkick', './assets/sound/dbz/mediumkick.ogg');
        this.load.audio('sound-mediumpunch', './assets/sound/dbz/mediumpunch.ogg');

        // Use this when character has level less than 100.
        this.load.audio('sound-strongkick', './assets/sound/dbz/strongkick.ogg');
        this.load.audio('sound-strongpunch', './assets/sound/dbz/strongpunch.ogg');

        this.load.text('font-saiyan-sans', './assets/fonts/Saiyan-Sans.ttf');
    }

    create() {
        this.add.image(0, 0, 'bg-fight-sky');

        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.set(0, Configuration.FIGHT_GRAVITY);
        this.world.setBounds(0, 0, this.game.width, this.game.height - 40);

        this.sound.jump = this.add.audio('sound-jump');
        this.sound.weakkick = this.add.audio('sound-weakkick');
        this.sound.weakpunch = this.add.audio('sound-weakpunch');

        this.sound.mediumkick = this.add.audio('sound-mediumkick');
        this.sound.mediumpunch = this.add.audio('sound-mediumpunch');

        this.sound.strongkick = this.add.audio('sound-strongkick');
        this.sound.strongpunch = this.add.audio('sound-strongpunch');

        this._setupEnemy();

        this._setupPlayerSprite();
        this._setupEnemySprite();

        this._setupKeyboard();

        this.loadSoundPreferences();
    }

    _setupEnemy() {
        // Random enemy from predefined list.
        let Character = this._randomEnemy();

        // Add player object as common in all states.
        this.game.enemy = new Character();

        console.log('Random character: ', this.game.enemy.name);
    }

    _addText(x, y, text, anchor = [0, 0]) {
        let label = this.add.text(x, y, text);
        label.font = 'SaiyanSans';
        label.fill = '#fff';
        label.anchor.setTo(...anchor);
    }

    _addAvatar(x, y, key) {
        let avatar = this.add.image(x, y, key);
        avatar.width = 50;
        avatar.height = 70;
    }

    _addBar(x, y, key, anchor = [0, 0]) {
        let blank = this.add.image(x, y, 'bar-blank');
        blank.anchor.setTo(...anchor);

        let bar = this.add.image(x, y, key);
        bar.anchor.setTo(...anchor);

        return bar
    }

    _setupPlayerSprite() {
        this._addText(21, 18, 'HP');
        this._addText(8, 48, 'EXP');
        this._addAvatar(6, 85, `${this.game.player.id}-card`);
        this._addText(63, 81, `${this.game.player.lvl} lvl`);

        this.bars.player.hp = this._addBar(55, 25, 'bar-hp');
        this._updatePlayerBarHP(50);

        this.bars.player.exp = this._addBar(55, 55, 'bar-exp');
        this._updatePlayerBarEXP(150);

        let player = this.game.player.phaser = this.add.sprite(150, 360, `${this.game.player.id}-spritesheet`);
        player.anchor.setTo(0, 1);
        this._defineDefaultProperties(player);
        FightState._defineAnimations(player, this.game.player.name);
    }

    _updatePlayerBarHP(x) {
        this.bars.player.hp.crop(new Phaser.Rectangle(0, 0, x, 16));
    }

    _updatePlayerBarEXP(x) {
        this.bars.player.exp.crop(new Phaser.Rectangle(0, 0, x, 16));
    }

    _setupEnemySprite() {
        this._addText(755, 18, 'HP');
        this._addText(755, 48, 'EXP');
        this._addAvatar(745, 85, `${this.game.enemy.id}-card`);
        this._addText(733, 81, `${this.game.enemy.lvl} lvl`, [1, 0]);

        this.bars.enemy.hp = this._addBar(746, 25, 'bar-hp-invert', [1, 0]);
        this._updateEnemyBarHP(50);

        this.bars.enemy.exp = this._addBar(746, 55, 'bar-exp-invert', [1, 0]);
        this._updateEnemyBarEXP(150);

        let enemy = this.game.enemy.phaser = this.add.sprite(650, 360, `${this.game.enemy.id}-spritesheet`);
        enemy.anchor.setTo(1, 1);
        this._defineDefaultProperties(enemy);
        FightState._defineAnimations(enemy, this.game.enemy.name);
    }

    _updateEnemyBarHP(x) {
        this.bars.enemy.hp.crop(new Phaser.Rectangle(x, 0, 256 - x, 16));
    }

    _updateEnemyBarEXP(x) {
        this.bars.enemy.exp.crop(new Phaser.Rectangle(x, 0, 256 - x, 16));
    }

    _setupKeyboard() {
        let player = this.game.player.phaser;

        let playKickSound = () => {
            let player = this.game.player;

            if (player.lvl < 30) {
                this.sound.weakkick.play();
            } else if (player.lvl < 60) {
                this.sound.mediumkick.play();
            } else {
                this.sound.strongkick.play();
            }
        };

        let playPunchSound = () => {
            let player = this.game.player;

            if (player.lvl < 30) {
                this.sound.weakpunch.play();
            } else if (player.lvl < 60) {
                this.sound.mediumpunch.play();
            } else {
                this.sound.strongpunch.play();
            }
        };

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
            playKickSound();
            console.log('Character "%s" is KICKING', this.game.player.name);
        });

        this.keyboard.x.onDown.add(() => {
            player.play('boxing');
            playPunchSound();
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
