import FightState from './fight-state';
import ArtificialIntelligence from '../../helpers/artificial-intelligence';

let assign = require('lodash.assign');
let config = require('../../configs');
let { shout } = require('../../helpers/message');
let { loadSoundPreferences } = require('../../helpers/audio');
let OptionsEnemyMixin = require('./options-enemy-mixin');
let OptionsPlayerMixin = require('./options-player-mixin');

/**
 * @extends FightState
 */
export default class VersusState extends FightState {
    audio = {
        jump: null,

        weakkick: null,
        weakpunch: null,

        mediumkick: null,
        mediumpunch: null,

        strongkick: null,
        strongpunch: null
    };
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
        assign(this, OptionsEnemyMixin);
        assign(this, OptionsPlayerMixin);
    }

    create() {
        this.add.image(0, 0, 'bg-versus-sky');

        this._setupWorld();
        this._setupSound();

        this._setupSprite(150, 360, this.game.player);
        this._setupSprite(650, 360, this.game.enemy, [1, 1]);

        this._setupPlayerOptions();
        this._setupEnemyOptions();

        this._setupFight();
        this._setupKeyboard();

        this.displayLogo();
        shout(this.game, { text: `${this.game.locale.VERSUS_STATE_WELCOME}` });

        loadSoundPreferences(this.game);
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

        playerSprite.events.onKicking.add(() => handlePlayerBlow(config.VERSUS_KICKING_POINTS));
        playerSprite.events.onBoxing.add(() => handlePlayerBlow(config.VERSUS_BOXING_POINTS));
        playerSprite.events.onDied.add(() => this._finishFight('died', 'win'));

        function handleEnemyBlow(points) {
            if (isCollision()) {
                context._addEnemyEXP(points);
                context._removePlayerHP(points);
            }
        }

        enemySprite.events.onKicking.add(() => handleEnemyBlow(config.VERSUS_KICKING_POINTS));
        enemySprite.events.onBoxing.add(() => handleEnemyBlow(config.VERSUS_BOXING_POINTS));
        enemySprite.events.onDied.add(() => this._finishFight('win', 'died'));

        ArtificialIntelligence.setup(this, enemySprite);
    }

    _finishFight(playerSate, enemyState) {
        let player = this.game.player;
        let playerSprite = player.getSprite();
        let enemy = this.game.enemy;
        let enemySprite = enemy.getSprite();

        // Wyłączamy wsparcie klawiatury w grze.
        this.input.keyboard.enabled = false;

        playerSprite.kill();
        enemySprite.kill();

        shout(this.game, { text: `${player.title} ${this.game.locale['VERSUS_STATE_PLAYER_' + playerSate.toUpperCase()]}!` });

        playerSprite.play(playerSate);
        enemySprite.play(enemyState);

        this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
            // Przywracamy wsparcie klawiatury w grze.
            this.input.keyboard.enabled = true;

            if (playerSate === 'died') {
                this.state.start('GameOver');
            } else {
                // Usuwamy pierwszego, pokonanego wroga.
                this.game.enemies.shift();
                this.game.emit('enemy:killed', { enemy: this.game.enemy });

                if (this.game.enemies.length === 0) {
                    this.state.start('Winner');
                } else {
                    this.state.start('Meal', true, false, {
                        lifespan: Phaser.Timer.SECOND * 4,
                        cb: () => {
                            this.state.start('Training', true, false, {
                                lifespan: Phaser.Timer.SECOND * 5,
                                cb: () => {
                                    this.state.start('EnemyPresentation', true, false, {
                                        lifespan: Phaser.Timer.SECOND * 2,
                                        cb: () => {
                                            this.state.start('Versus');
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    update() {
        let enemySprite = this.game.enemy.getSprite();
        FightState.resetCharacterVelocity(enemySprite);
        super.update();
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
