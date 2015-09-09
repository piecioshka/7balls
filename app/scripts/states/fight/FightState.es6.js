import Configuration from '../../configuration';
import AbstractState from '../AbstractState';

class FightState extends AbstractState {
    preload() {
        super.preload();

        this.load.image('bg-versus-hell', './assets/graphics/backgrounds/bg-versus-hell.png');
        this.load.image('bg-versus-sky', './assets/graphics/backgrounds/bg-versus-sky.png');

        this.load.image('logo-minimal', './assets/graphics/logo/logo-minimal.png');

        this.load.image('bar-blank', './assets/graphics/bars/blank.png');
        this.load.image('bar-hp', './assets/graphics/bars/hp.png');
        this.load.image('bar-exp', './assets/graphics/bars/exp.png');

        this.load.spritesheet('goku-spritesheet', './assets/graphics/characters/goku/goku-fight.png', 150, 200);
        this.load.spritesheet('vegeta-spritesheet', './assets/graphics/characters/vegeta/vegeta-fight.png', 150, 200);

        this.load.spritesheet('freeza-spritesheet', './assets/graphics/characters/freeza/freeza-fight.png', 150, 200);
        this.load.spritesheet('cell-spritesheet', './assets/graphics/characters/cell/cell-fight.png', 150, 200);
        this.load.spritesheet('bubu-spritesheet', './assets/graphics/characters/bubu/bubu-fight.png', 150, 200);

        this.load.audio('sound-jump', './assets/sound/dbz/jump.ogg');

        // Use this when character has level less than first threshold.
        this.load.audio('sound-weakkick', './assets/sound/dbz/weakkick.ogg');
        this.load.audio('sound-weakpunch', './assets/sound/dbz/weakpunch.ogg');

        // Use this when character has level less than second threshold.
        this.load.audio('sound-mediumkick', './assets/sound/dbz/mediumkick.ogg');
        this.load.audio('sound-mediumpunch', './assets/sound/dbz/mediumpunch.ogg');

        // Use this when character has level less than max.
        this.load.audio('sound-strongkick', './assets/sound/dbz/strongkick.ogg');
        this.load.audio('sound-strongpunch', './assets/sound/dbz/strongpunch.ogg');
    }

    displayLogo() {
        this.add.image((this.game.width / 2) - (this.cache.getImage('logo-minimal').width / 2), 5, 'logo-minimal');
    }

    _setupWorld() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.set(0, Configuration.FIGHT_GRAVITY);
        this.world.setBounds(0, 0, this.game.width, this.game.height - Configuration.FIGHT_BOTTOM_MARGIN);
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

    _addAvatar(x, y, key) {
        let avatar = this.add.image(x, y, key);
        avatar.width = Configuration.FIGHT_CHARACTER_AVATAR_WIDTH;
        avatar.height = Configuration.FIGHT_CHARACTER_AVATAR_HEIGHT;
    }

    _addBar(x, y, key, anchor = [0, 0]) {
        let blank = this.add.image(x, y, 'bar-blank');
        blank.anchor.setTo(...anchor);

        let color = this.add.image(x, y, key);
        color.anchor.setTo(...anchor);

        return { blank, color };
    }

    _setupSprite(x, y, character, anchor = [0, 1]) {
        character.phaser = this.add.sprite(x, y, `${character.id}-spritesheet`);
        character.phaser.anchor.setTo(...anchor);

        character.phaser.events.onLeft = new Phaser.Signal();
        character.phaser.events.onLeft.add(() => {
            character.phaser.body.velocity.x -= Configuration.FIGHT_SPEED;
            console.log('Character "%s" is LEFT', character.name);
        });

        character.phaser.events.onRight = new Phaser.Signal();
        character.phaser.events.onRight.add(() => {
            character.phaser.body.velocity.x += Configuration.FIGHT_SPEED;
            console.log('Character "%s" is RIGHT', character.name);
        });

        character.phaser.events.onSitting = new Phaser.Signal();
        character.phaser.events.onSitting.add(() => {
            character.phaser.play('sitting');
            console.log('Character "%s" is SITTING', character.name);
        });

        character.phaser.events.onJumping = new Phaser.Signal();
        character.phaser.events.onJumping.add(() => {
            this.sound.jump.play();

            character.phaser.body.velocity.y -= Configuration.FIGHT_JUMP;

            character.phaser.play('jumping');
            console.log('Character "%s" is JUMPING', character.name);
        });

        character.phaser.events.onKicking = new Phaser.Signal();
        character.phaser.events.onKicking.add(() => {
            this._playKickSound(character);

            character.phaser.play('kicking');
            console.log('Character "%s" is KICKING', character.name);
        });
        character.phaser.events.onBoxing = new Phaser.Signal();
        character.phaser.events.onBoxing.add(() => {
            this._playPunchSound(character);

            character.phaser.play('boxing');
            console.log('Character "%s" is BOXING', character.name);
        });
        character.phaser.events.onDied = new Phaser.Signal();

        this._defineDefaultProperties(character.phaser);
        FightState._defineAnimations(character.phaser, character.name);
    }

    _setupPlayerOptions() {
        let player = this.game.player;

        this.addSaiyanLabel(21, 18, 'HP');
        this.addSaiyanLabel(8, 48, 'EXP');
        this._addAvatar(6, 85, `${player.id}-card`);

        this.options.player.lvl = this.addSaiyanLabel(63, 81, `${player.lvl} lvl`);

        this.options.player.hp = this._addBar(55, 25, 'bar-hp');
        this._updatePlayerOptionsHP();

        this.options.player.exp = this._addBar(55, 55, 'bar-exp');
        this._updatePlayerOptionsEXP();
    }

    _updatePlayerOptionsHP() {
        let hp = this.game.player.hp;
        let imageWidth = this.cache.getImage('bar-hp').width;
        let width = hp * imageWidth / 100;
        this.options.player.hp.color.crop(new Phaser.Rectangle(0, 0, width, 16));
    }

    _updatePlayerOptionsEXP() {
        let exp = this.game.player.exp;
        let imageWidth = this.cache.getImage('bar-exp').width;
        let width = exp * imageWidth / 100;
        this.options.player.exp.color.crop(new Phaser.Rectangle(0, 0, width, 16));
    }

    _updateOptionsLvL(character) {
        this.options[character].lvl.setText(`${this.game[character].lvl} lvl`);
    }

    _removePlayerHP(value) {
        let player = this.game.player;
        player.hp -= value;

        if (player.hp <= 0) {
            player.hp = 0;
            player.phaser.events.onDied.dispatch();
        }

        this._updatePlayerOptionsHP();
        this._updateOptionsLvL('player');
    }

    _addPlayerEXP(value) {
        let player = this.game.player;
        player.exp += value;

        if (player.exp >= Configuration.PLAYER_MAXIMUM_EXPERIENCE) {
            player.exp = 0;

            if (player.lvl < Configuration.PLAYER_MAXIMUM_LEVEL) {
                player.lvl++;
            }
        }

        this._updatePlayerOptionsEXP();
        this._updateOptionsLvL('player');
    }

    _setupSound() {
        this.sound.jump = this.add.audio('sound-jump');

        this.sound.weakkick = this.add.audio('sound-weakkick');
        this.sound.weakpunch = this.add.audio('sound-weakpunch');

        this.sound.mediumkick = this.add.audio('sound-mediumkick');
        this.sound.mediumpunch = this.add.audio('sound-mediumpunch');

        this.sound.strongkick = this.add.audio('sound-strongkick');
        this.sound.strongpunch = this.add.audio('sound-strongpunch');
    }

    _playKickSound(character) {
        switch (true) {
            case character.lvl < Configuration.FIGHT_LEVELS_THRESHOLD[0]:
                this.sound.weakkick.play();
                break;

            case character.lvl < Configuration.FIGHT_LEVELS_THRESHOLD[1]:
                this.sound.mediumkick.play();
                break;

            default:
                this.sound.strongkick.play();
        }
    }

    _playPunchSound(character) {
        switch (true) {
            case character.lvl < Configuration.FIGHT_LEVELS_THRESHOLD[0]:
                this.sound.weakpunch.play();
                break;

            case character.lvl < Configuration.FIGHT_LEVELS_THRESHOLD[1]:
                this.sound.mediumpunch.play();
                break;

            default:
                this.sound.strongpunch.play();
        }
    }

    _setupKeyboard() {
        let player = this.game.player;

        this.keyboard.c = this.input.keyboard.addKey(Phaser.Keyboard.C);
        this.keyboard.x = this.input.keyboard.addKey(Phaser.Keyboard.X);
        this.keyboard.up = this.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.keyboard.space = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // Stop the following keys from propagating up to the browser
        this.input.keyboard.addKeyCapture([
            Phaser.Keyboard.C,
            Phaser.Keyboard.X,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.SPACEBAR
        ]);

        this.keyboard.c.onDown.add(() => {
            player.phaser.events.onKicking.dispatch();
        });

        this.keyboard.x.onDown.add(() => {
            player.phaser.events.onBoxing.dispatch();
        });

        let handlePlayerJump = () => {
            if (player.phaser.body.onFloor()) {
                player.phaser.events.onJumping.dispatch();
            }
        };

        this.keyboard.up.onDown.add(handlePlayerJump);
        this.keyboard.space.onDown.add(handlePlayerJump);
    }

    update() {
        this._handleKeyboard();
    }

    static _handleCharacterVelocity(character) {
        character.phaser.body.velocity.x = 0;
        character.phaser.body.velocity.y += 7;
    }

    _handleKeyboard() {
        let player = this.game.player;
        let keyboard = this.input.keyboard;

        FightState._handleCharacterVelocity(player);

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            player.phaser.events.onLeft.dispatch();
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            player.phaser.events.onRight.dispatch();
        }

        if (keyboard.isDown(Phaser.Keyboard.DOWN)) {
            player.phaser.events.onSitting.dispatch();
        }
    }
}

export default FightState;
