let debug = {
    log: require('debug')('7balls:fight-state:log')
};

let config = require('../../constants/configs');

function defineAnimations(character, reduceByHalf, revertDefaultSize) {
    let sprite = character.getSprite();
    let width = 150;
    let height = 200;

    function resizeMaximum() {
        sprite.body.setSize(width, height, 0, 0);
    }

    let sitting = sprite.animations.add('sitting', [4, 5], 4, false);

    sitting.onStart.add(reduceByHalf);
    sitting.onComplete.add(revertDefaultSize);

    let kicking = sprite.animations.add('kicking', [12, 13], 16, false);

    kicking.onStart.add(resizeMaximum);
    kicking.onComplete.add(revertDefaultSize);

    let boxing = sprite.animations.add('boxing', [16, 17], 16, false);

    boxing.onStart.add(resizeMaximum);
    boxing.onComplete.add(revertDefaultSize);

    sprite.animations.add('standing', [0, 1, 2], 4, true);
    sprite.animations.add('jumping', [8, 9], 4, false);
    sprite.animations.add('win', [20, 21], 4, false);
    sprite.animations.add('died', [24, 25], 4, false);

    sprite.play('standing');

    debug.log('Character "%s" is STANDING', character.title);
}

function resetCharacterVelocity(sprite) {
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y += config.FIGHT_FALL_SPEED;
}

export default class FightState extends Phaser.State {
    static resetCharacterVelocity = resetCharacterVelocity;

    displayLogo() {
        this.add.image((this.game.width / 2) - (this.cache.getImage('logo-minimal').width / 2), 5, 'logo-minimal');
    }

    _setupWorld() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.setTo(0, 1);
        this.world.setBounds(0, 0, this.game.width, this.game.height - config.FIGHT_BOTTOM_MARGIN);
    }

    _defineDefaultProperties(character) {
        let sprite = character.getSprite();

        // Tutaj tworzymy ciało dla naszej postaci.
        this.physics.arcade.enable(sprite);

        sprite.body.bounce.setTo(0, 0.1);
        sprite.body.collideWorldBounds = true;
    }

    /**
     * @param {Character} character
     * @param {string} orientation [left, right]
     * @access protected
     */
    _setupOrientation(character, orientation) {
        let sprite = character.getSprite();
        let width = 150;
        let height = 200;
        let defaultSize = null;
        let reduceByHalf = null;

        if (orientation === sprite.orientation) {
            // Nie zmieniamy orientacji na już wybraną.
            return;
        }

        sprite.orientation = orientation;

        switch (orientation) {
            case 'left':
                defaultSize = () => {
                    sprite.body.setSize((width * 2) / 3, height, 0, 0);
                };

                reduceByHalf = () => {
                    sprite.body.setSize((width * 2) / 3, height / 2, 0, height / 2);
                };

                defineAnimations(character, reduceByHalf, defaultSize);
                defaultSize();
                break;

            case 'right':
                defaultSize = () => {
                    sprite.body.setSize((width * 2) / 3, height, width / 3, 0);
                };

                reduceByHalf = () => {
                    sprite.body.setSize((width * 2) / 3, height / 2, width / 3, height / 2);
                };

                defineAnimations(character, reduceByHalf, defaultSize);
                defaultSize();
                break;

            default:
            // no default
        }
    }

    _addAvatar(x, y, key) {
        let avatar = this.add.image(x, y, key);

        avatar.width = config.FIGHT_CHARACTER_AVATAR_WIDTH;
        avatar.height = config.FIGHT_CHARACTER_AVATAR_HEIGHT;
    }

    _addBar(x, y, key, anchor = [0, 0]) {
        let blank = this.add.image(x, y, 'bar-blank');
        let color = this.add.image(x, y, key);

        blank.anchor.setTo(...anchor);
        color.anchor.setTo(...anchor);

        return { blank, color };
    }

    _setupSprite(x, y, character, anchor = [0, 1]) {
        character.createSprite(this, x, y, `${character.id}-spritesheet`);

        let sprite = character.getSprite();
        sprite.anchor.setTo(...anchor);

        this._defineDefaultProperties(character);

        this._setupMoves(character);
    }

    _setupMoves(character) {
        let sprite = character.getSprite();

        sprite.events.onLeft = new Phaser.Signal();
        sprite.events.onLeft.add(() => {
            sprite.body.velocity.x -= config.FIGHT_HORIZONTAL_SPEED;

            debug.log('Character "%s" is LEFT', character.title);
        });

        sprite.events.onRight = new Phaser.Signal();
        sprite.events.onRight.add(() => {
            sprite.body.velocity.x += config.FIGHT_HORIZONTAL_SPEED;

            debug.log('Character "%s" is RIGHT', character.title);
        });

        sprite.events.onSitting = new Phaser.Signal();
        sprite.events.onSitting.add(() => {
            sprite.play('sitting');

            debug.log('Character "%s" is SITTING', character.title);
        });

        sprite.events.onJumping = new Phaser.Signal();
        sprite.events.onJumping.add(() => {
            if (!sprite.body.onFloor()) {
                return;
            }

            this.audio.jump.play();

            sprite.body.velocity.y -= config.FIGHT_JUMP;

            sprite.play('jumping');

            debug.log('Character "%s" is JUMPING', character.title);
        });

        sprite.events.onKicking = new Phaser.Signal();
        sprite.events.onKicking.add(() => {
            this._playKickSound(character);

            sprite.play('kicking');

            debug.log('Character "%s" is KICKING', character.title);
        });

        sprite.events.onBoxing = new Phaser.Signal();
        sprite.events.onBoxing.add(() => {
            this._playPunchSound(character);

            sprite.play('boxing');

            debug.log('Character "%s" is BOXING', character.title);
        });
        sprite.events.onDied = new Phaser.Signal();
    }

    _updateOptionsLvL(character) {
        this.options[character].lvl.setText(`${this.game[character].lvl} ${this.game.locale.FIGHT_STATE_LEVEL_SHORT}`);
    }

    _setupSound() {
        this.audio.jump = this.add.audio('sound-jump');

        this.audio.weakkick = this.add.audio('sound-weakkick');
        this.audio.weakpunch = this.add.audio('sound-weakpunch');

        this.audio.mediumkick = this.add.audio('sound-mediumkick');
        this.audio.mediumpunch = this.add.audio('sound-mediumpunch');

        this.audio.strongkick = this.add.audio('sound-strongkick');
        this.audio.strongpunch = this.add.audio('sound-strongpunch');
    }

    _playKickSound(character) {
        switch (true) {
            case character.lvl < config.FIGHT_LEVELS_THRESHOLD[0]:
                this.audio.weakkick.play();
                break;

            case character.lvl < config.FIGHT_LEVELS_THRESHOLD[1]:
                this.audio.mediumkick.play();
                break;

            default:
                this.audio.strongkick.play();
        }
    }

    _playPunchSound(character) {
        switch (true) {
            case character.lvl < config.FIGHT_LEVELS_THRESHOLD[0]:
                this.audio.weakpunch.play();
                break;

            case character.lvl < config.FIGHT_LEVELS_THRESHOLD[1]:
                this.audio.mediumpunch.play();
                break;

            default:
                this.audio.strongpunch.play();
        }
    }

    _setupKeyboard() {
        let playerSprite = this.game.player.getSprite();

        let c = this.input.keyboard.addKey(Phaser.Keyboard.C);
        let x = this.input.keyboard.addKey(Phaser.Keyboard.X);
        let up = this.input.keyboard.addKey(Phaser.Keyboard.UP);
        let space = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // Wstrzymujemy propagację zdarzeń w oknie przeglądarki.
        this.input.keyboard.addKeyCapture([
            Phaser.Keyboard.C,
            Phaser.Keyboard.X,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.SPACEBAR
        ]);

        c.onDown.add(() => playerSprite.events.onKicking.dispatch());
        x.onDown.add(() => playerSprite.events.onBoxing.dispatch());
        up.onDown.add(() => playerSprite.events.onJumping.dispatch());
        space.onDown.add(() => playerSprite.events.onJumping.dispatch());
    }

    update() {
        let playerSprite = this.game.player.getSprite();
        resetCharacterVelocity(playerSprite);
        this._handleKeyboard();
    }

    _handleKeyboard() {
        let playerSprite = this.game.player.getSprite();
        let keyboard = this.input.keyboard;

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            playerSprite.events.onLeft.dispatch();
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            playerSprite.events.onRight.dispatch();
        }

        if (keyboard.isDown(Phaser.Keyboard.DOWN)) {
            playerSprite.events.onSitting.dispatch();
        }
    }
}
