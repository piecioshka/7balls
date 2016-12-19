const FIGHT = require('../../constants/fight');

import ArtificialIntelligence from '../../helpers/artificial-intelligence';
import Enemy from '../../models/enemy';

let assert = require('assert');
let isString = require('lodash.isstring');
let utils = require('../../helpers/utils');
let { displaySingleLineMessage } = require('../../helpers/message');
let OptionsEnemyMixin = require('../mixins/options-enemy-mixin');
let OptionsPlayerMixin = require('../mixins/options-player-mixin');

function defineAnimations(character, revertDefaultSize) {
    let $sprite = character.getSprite();
    let width = 150;
    let height = 200;

    function resizeMaximum() {
        $sprite.body.setSize(width, height, 0, 0);
    }

    $sprite.animations.add('standing', [0, 1, 2], 4, true);
    $sprite.animations.add('win', [3, 4], 4, false);
    $sprite.animations.add('died', [6, 7], 4, false);

    let kicking = $sprite.animations.add('kicking', [9, 10], 16, false);
    kicking.onStart.add(resizeMaximum);
    kicking.onComplete.add(revertDefaultSize);
    kicking.onComplete.add(() => {
        $sprite.play('standing');
    });

    let boxing = $sprite.animations.add('boxing', [12, 13], 16, false);
    boxing.onStart.add(resizeMaximum);
    boxing.onComplete.add(revertDefaultSize);
    boxing.onComplete.add(() => {
        $sprite.play('standing');
    });
}

function resetCharacterVelocity($sprite) {
    $sprite.body.velocity.x = 0;
    $sprite.body.velocity.y += FIGHT.FALL_SPEED;
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

    displayLogo() {
        this.add.image((this.game.width / 2) - (this.cache.getImage('logo').width / 2), 5, 'logo');
    }

    _setupWorld() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.setTo(0, 1);
        this.world.setBounds(0, 0, this.game.width, this.game.height - FIGHT.BOTTOM_MARGIN);
    }

    /**
     * @param {Character} character
     * @param {string} orientation [left, right]
     * @access protected
     */
    _getOrientationResetSize(character, orientation) {
        let $sprite = character.getSprite();
        let width = 150;
        let height = 200;

        if (orientation === $sprite.orientation) {
            // Nie zmieniamy orientacji na już wybraną.
            return;
        }

        $sprite.orientation = orientation;

        return () => {
            switch (orientation) {
                case 'left':
                    $sprite.body.setSize((width * 2) / 3, height, 0, 0);
                    break;

                case 'right':
                    $sprite.body.setSize((width * 2) / 3, height, width / 3, 0);
                    break;

                default:
                // no default
            }
        };
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
        character.createSprite(this, x, y, `${character.id}-fight`);

        let $sprite = character.getSprite();
        $sprite.anchor.setTo(...anchor);

        // Tutaj tworzymy ciało dla naszej postaci.
        this.physics.arcade.enable($sprite);

        $sprite.body.bounce.setTo(0, 0.1);
        $sprite.body.collideWorldBounds = true;

        this._setupMoves(character);
    }

    _setupMoves(character) {
        let $sprite = character.getSprite();

        $sprite.events.onLeft = new Phaser.Signal();
        $sprite.events.onLeft.add(() => {
            $sprite.body.velocity.x -= FIGHT.HORIZONTAL_SPEED;
        });

        $sprite.events.onRight = new Phaser.Signal();
        $sprite.events.onRight.add(() => {
            $sprite.body.velocity.x += FIGHT.HORIZONTAL_SPEED;
        });

        $sprite.events.onJumping = new Phaser.Signal();
        $sprite.events.onJumping.add(() => {
            if (!$sprite.body.onFloor()) {
                return;
            }

            $sprite.body.velocity.y -= FIGHT.JUMP;
        });

        $sprite.events.onKicking = new Phaser.Signal();
        $sprite.events.onKicking.add(() => {
            $sprite.play('kicking');
        });

        $sprite.events.onBoxing = new Phaser.Signal();
        $sprite.events.onBoxing.add(() => {
            $sprite.play('boxing');
        });
        $sprite.events.onDied = new Phaser.Signal();
    }

    _updateOptionsLvL(character) {
        this.options[character].lvl.setText(`${this.game[character].lvl} ${this.game.locale.FIGHT_STATE_LEVEL_SHORT}`);
    }

    _setupKeyboard() {
        let $playerSprite = this.game.player.getSprite();

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

        c.onDown.add(() => $playerSprite.events.onKicking.dispatch());
        x.onDown.add(() => $playerSprite.events.onBoxing.dispatch());
        up.onDown.add(() => $playerSprite.events.onJumping.dispatch());
        space.onDown.add(() => $playerSprite.events.onJumping.dispatch());
    }

    _setupEnemy() {
        // Współdzielimy obiekt wroga między stana w grze.
        this.game.enemy = new Enemy();

        // Pobieramy pierwszego wroga. Każde zwycięstwo eliminuje pierwszego z listy.
        this.game.enemy.setPersonality(this.game.enemies[0]);
    }

    create() {
        Object.assign(this, OptionsEnemyMixin, OptionsPlayerMixin);

        this.add.image(0, 0, 'bg-select-player');

        this._setupWorld();
        this._setupEnemy();

        this._setupSprite(150, 360, this.game.player);
        this._setupSprite(650, 360, this.game.enemy, [1, 1]);

        this._setupFightersActions();

        this._setupPlayerOptions();
        this._setupEnemyOptions();

        this._setupFight();
        this._setupKeyboard();

        this.displayLogo();
        displaySingleLineMessage(this.game, `${this.game.locale.FIGHT_STATE_WELCOME}`);
    }

    _setupFightersActions() {
        let playerResetSize = this._getOrientationResetSize(this.game.player, 'left');
        defineAnimations(this.game.player, playerResetSize);
        playerResetSize();
        this.game.player.getSprite().play('standing');

        let enemyResetSize = this._getOrientationResetSize(this.game.enemy, 'right');
        defineAnimations(this.game.enemy, enemyResetSize);
        enemyResetSize();
        this.game.enemy.getSprite().play('standing');
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
        let $playerSprite = this.game.player.getSprite();
        let $enemySprite = this.game.enemy.getSprite();

        function isCollision() {
            return context.physics.arcade.overlap($enemySprite, $playerSprite);
        }

        function handlePlayerBlow(points) {
            if (isCollision()) {
                context._addPlayerEXP(points * 1.75);
                context._removeEnemyHP(points);
            }
        }

        $playerSprite.events.onKicking.add(() => handlePlayerBlow(FIGHT.KICKING_POINTS));
        $playerSprite.events.onBoxing.add(() => handlePlayerBlow(FIGHT.BOXING_POINTS));
        $playerSprite.events.onDied.add(() => this._finishFight('died', 'win'));

        function handleEnemyBlow(points) {
            if (isCollision()) {
                context._addEnemyEXP(points);
                context._removePlayerHP(points);
            }
        }

        $enemySprite.events.onKicking.add(() => handleEnemyBlow(FIGHT.KICKING_POINTS));
        $enemySprite.events.onBoxing.add(() => handleEnemyBlow(FIGHT.BOXING_POINTS));
        $enemySprite.events.onDied.add(() => this._finishFight('win', 'died'));

        ArtificialIntelligence.setup(this, $enemySprite);
    }

    _getLocaleStatus(playerState) {
        assert(isString(playerState));
        let status = playerState.toLowerCase();

        let strategies = new Map();
        strategies.set('win', this.game.locale.FIGHT_STATE_PLAYER_WIN);
        strategies.set('died', this.game.locale.FIGHT_STATE_PLAYER_DIED);

        let locale = strategies.get(status);
        assert(isString(locale));

        return locale;
    }

    _finishFight(playerState, enemyState) {
        let player = this.game.player;
        let $playerSprite = player.getSprite();
        let enemy = this.game.enemy;
        let $enemySprite = enemy.getSprite();

        displaySingleLineMessage(this.game, `${player.title} ${this._getLocaleStatus(playerState)}`);

        // Wyłączamy wsparcie klawiatury w grze.
        this.input.keyboard.enabled = false;

        // Sprowadzamy postacie na ziemie.
        $playerSprite.body.velocity.setTo(0, 0);
        $enemySprite.body.velocity.setTo(0, 0);

        // Włączamy animacje: zwycięstwa i porażki.
        $playerSprite.play(playerState);
        $enemySprite.play(enemyState);

        // Uśmiercam obu, aby żadne animacje nie były więcej wykonywane.
        // Nie używamy .kill() bo wtedy nie wykona się ost. animacja (zwycięstwa i porażki).
        $playerSprite.alive = false;
        $enemySprite.alive = false;

        utils.timeout(this, Phaser.Timer.SECOND * 2, () => {
            // Przywracamy wsparcie klawiatury w grze.
            this.input.keyboard.enabled = true;

            if (playerState === 'died') {
                this.game.emit('game:over', { enemy: this.game.enemy });
            } else {
                // Usuwamy pierwszego, pokonanego wroga.
                this.game.enemies.shift();
                this.game.emit('enemy:killed', { enemy: this.game.enemy });
            }
        });
    }

    _handleKeyboard() {
        let $playerSprite = this.game.player.getSprite();
        let keyboard = this.input.keyboard;

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            $playerSprite.events.onLeft.dispatch();
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            $playerSprite.events.onRight.dispatch();
        }
    }

    render() {
        let $playerSprite = this.game.player.getSprite();
        // this.game.debug.bodyInfo($playerSprite, 25, 25);
        this.game.debug.body($playerSprite);

        let $enemySprite = this.game.enemy.getSprite();
        // this.game.debug.bodyInfo($enemySprite, 25, 225);
        this.game.debug.body($enemySprite);
    }
}
