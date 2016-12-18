let debug = {
    log: require('debug')('7balls:fight-state:log')
};

const FIGHT = require('../../constants/fight');

import ArtificialIntelligence from '../../helpers/artificial-intelligence';

let assert = require('assert');
let isString = require('lodash.isstring');
let utils = require('../../helpers/utils');
let { displaySingleLineMessage } = require('../../helpers/message');
let OptionsEnemyMixin = require('../mixins/options-enemy-mixin');
let OptionsPlayerMixin = require('../mixins/options-player-mixin');
import Enemy from '../../models/enemy';

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
    sprite.body.velocity.y += FIGHT.FALL_SPEED;
}

export default class FightState extends Phaser.State {
    options = {
        player: {
            hp: null,
            exp: null,
            lvl: null
        },
        enemy: {
            hp: null,
            exp: null,
            lvl: null
        }
    };

    init() {
        Object.assign(this, OptionsEnemyMixin);
        Object.assign(this, OptionsPlayerMixin);
    }

    displayLogo() {
        this.add.image((this.game.width / 2) - (this.cache.getImage('logo').width / 2), 5, 'logo');
    }

    _setupWorld() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.setTo(0, 1);
        this.world.setBounds(0, 0, this.game.width, this.game.height - FIGHT.BOTTOM_MARGIN);
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

        avatar.width = FIGHT.CHARACTER_AVATAR_WIDTH;
        avatar.height = FIGHT.CHARACTER_AVATAR_HEIGHT;
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
            sprite.body.velocity.x -= FIGHT.HORIZONTAL_SPEED;

            debug.log('Character "%s" is LEFT', character.title);
        });

        sprite.events.onRight = new Phaser.Signal();
        sprite.events.onRight.add(() => {
            sprite.body.velocity.x += FIGHT.HORIZONTAL_SPEED;

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

            sprite.body.velocity.y -= FIGHT.JUMP;
            sprite.play('jumping');
            debug.log('Character "%s" is JUMPING', character.title);
        });

        sprite.events.onKicking = new Phaser.Signal();
        sprite.events.onKicking.add(() => {
            sprite.play('kicking');
            debug.log('Character "%s" is KICKING', character.title);
        });

        sprite.events.onBoxing = new Phaser.Signal();
        sprite.events.onBoxing.add(() => {
            sprite.play('boxing');
            debug.log('Character "%s" is BOXING', character.title);
        });
        sprite.events.onDied = new Phaser.Signal();
    }

    _updateOptionsLvL(character) {
        this.options[character].lvl.setText(`${this.game[character].lvl} ${this.game.locale.FIGHT_STATE_LEVEL_SHORT}`);
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

    _setupEnemy() {
        // Współdzielimy obiekt wroga między stana w grze.
        this.game.enemy = new Enemy();

        // Pobieramy pierwszego wroga. Każde zwycięstwo eliminuje pierwszego z listy.
        this.game.enemy.setPersonality(this.game.enemies[0]);
    }

    create() {
        this.add.image(0, 0, 'bg-select-player');

        this._setupWorld();

        this._setupEnemy();

        this._setupSprite(150, 360, this.game.player);
        this._setupSprite(650, 360, this.game.enemy, [1, 1]);

        this._setupOrientation(this.game.player, 'left');
        this._setupOrientation(this.game.enemy, 'right');

        this._setupPlayerOptions();
        this._setupEnemyOptions();

        this._setupFight();
        this._setupKeyboard();

        this.displayLogo();
        displaySingleLineMessage(this.game, `${this.game.locale.FIGHT_STATE_WELCOME}`);
    }

    update() {
        let enemySprite = this.game.enemy.getSprite();
        let playerSprite = this.game.player.getSprite();
        this.physics.arcade.collide(enemySprite, playerSprite);
        resetCharacterVelocity(enemySprite);
        resetCharacterVelocity(playerSprite);
        this._handleKeyboard();
    }

    _setupFight() {
        let context = this;
        let playerSprite = this.game.player.getSprite();
        let enemySprite = this.game.enemy.getSprite();

        function isCollision() {
            return context.physics.arcade.overlap(enemySprite, playerSprite);
        }

        function handlePlayerBlow(points) {
            if (isCollision()) {
                context._addPlayerEXP(points * 1.75);
                context._removeEnemyHP(points);
            }
        }

        playerSprite.events.onKicking.add(() => handlePlayerBlow(FIGHT.KICKING_POINTS));
        playerSprite.events.onBoxing.add(() => handlePlayerBlow(FIGHT.BOXING_POINTS));
        playerSprite.events.onDied.add(() => this._finishFight('died', 'win'));

        function handleEnemyBlow(points) {
            if (isCollision()) {
                context._addEnemyEXP(points);
                context._removePlayerHP(points);
            }
        }

        enemySprite.events.onKicking.add(() => handleEnemyBlow(FIGHT.KICKING_POINTS));
        enemySprite.events.onBoxing.add(() => handleEnemyBlow(FIGHT.BOXING_POINTS));
        enemySprite.events.onDied.add(() => this._finishFight('win', 'died'));

        ArtificialIntelligence.setup(this, enemySprite);
    }

    _getLocaleStatus(playerSate) {
        assert(isString(playerSate));
        let status = playerSate.toLowerCase();

        let strategies = new Map();
        strategies.set('win', this.game.locale.FIGHT_STATE_PLAYER_WIN);
        strategies.set('died', this.game.locale.FIGHT_STATE_PLAYER_DIED);

        let locale = strategies.get(status);
        assert(isString(locale));

        return locale;
    }

    _finishFight(playerSate, enemyState) {
        let player = this.game.player;
        let playerSprite = player.getSprite();
        let enemy = this.game.enemy;
        let enemySprite = enemy.getSprite();

        displaySingleLineMessage(this.game, `${player.title} ${this._getLocaleStatus(playerSate)}`);

        // Wyłączamy wsparcie klawiatury w grze.
        this.input.keyboard.enabled = false;

        // Sprowadzamy postacie na ziemie.
        playerSprite.y = 0;
        enemySprite.y = 0;

        // Włączamy animacje: zwycięstwa i porażki.
        playerSprite.play(playerSate);
        enemySprite.play(enemyState);

        // Uśmiercam obu, aby żadne animacje nie były więcej wykonywane.
        // Nie używamy .kill() bo wtedy nie wykona się ost. animacja (zwycięstwa i porażki).
        playerSprite.alive = false;
        enemySprite.alive = false;

        utils.timeout(this, Phaser.Timer.SECOND * 2, () => {
            // Przywracamy wsparcie klawiatury w grze.
            this.input.keyboard.enabled = true;

            if (playerSate === 'died') {
                this.game.emit('game:over', { enemy: this.game.enemy });
            } else {
                // Usuwamy pierwszego, pokonanego wroga.
                this.game.enemies.shift();
                this.game.emit('enemy:killed', { enemy: this.game.enemy });
            }
        });
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

    render() {
        let playerSprite = this.game.player.getSprite();
        // this.game.debug.bodyInfo(playerSprite, 25, 25);
        this.game.debug.body(playerSprite);

        let enemySprite = this.game.enemy.getSprite();
        // this.game.debug.bodyInfo(enemySprite, 25, 225);
        this.game.debug.body(enemySprite);
    }
}
