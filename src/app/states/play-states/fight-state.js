const FIGHT = require('../../constants/fight');
const POWER = require('../../constants/power');
const ROUNDS = require('../../constants/rounds');

import ArtificialIntelligence from '../../helpers/artificial-intelligence';
import Enemy from '../../models/enemy';

let assert = require('assert');
let isString = require('lodash.isstring');
let utils = require('../../helpers/utils');
let { displaySingleLineMessage, displayTitleMessage } = require('../../helpers/message');
let OptionsEnemyMixin = require('../mixins/options-enemy-mixin');
let OptionsPlayerMixin = require('../mixins/options-player-mixin');
let { addBackground } = require('../../helpers/background');
let { FRAMES, frameOf, isSaiyan, fightSpriteOf } = require('../../helpers/sprites');

// A character takes the middle of a 150x200 frame; during a blow its body
// reaches the edge of the frame in front of it.
const FRAME_WIDTH = 150;
const FRAME_HEIGHT = 200;
const BODY_WIDTH = 70;
const REACH_WIDTH = 115;
const BODY_OFFSET = { right: 35, left: 45 };
const REACH_OFFSET = { right: 35, left: 0 };
// Part of the frame (from its back edge) where the back of a character is.
const BACK_EDGE = 0.12;
// A blow reaches a target which stands a little behind, pressed close.
const BEHIND_REACH = 10;

const AURA_TINTS = { ssj: 0xffd030, ssj2: 0xffe060, ssj3: 0xffc020, god: 0xff5a40, blue: 0x50c8ff, kaioken: 0xff2a20 };
// The glow grows from below the feet, so it surrounds them too.
const AURA_DROP = 6;

/**
 * @param {Phaser.Sprite} $sprite
 * @param {string} name "standing", "boxing", "kicking", "win" or "died".
 */
export function playPose($sprite, name) {
    $sprite.play(`${name}-${$sprite.facing}`);
}

/**
 * Sets the size of the body: wider in front during a blow.
 */
export function setReach($sprite, isReaching) {
    let facing = $sprite.facing;

    $sprite.isReaching = isReaching;

    if (isReaching) {
        $sprite.body.setSize(REACH_WIDTH, FRAME_HEIGHT, REACH_OFFSET[facing], 0);
    } else {
        $sprite.body.setSize(BODY_WIDTH, FRAME_HEIGHT, BODY_OFFSET[facing], 0);
    }
}

/**
 * Turns a character to the right or to the left.
 */
export function setFacing($sprite, facing) {
    if ($sprite.facing === facing) {
        return;
    }

    $sprite.facing = facing;
    setReach($sprite, $sprite.isReaching);

    let animation = $sprite.animations.currentAnim;

    if (animation && animation.isPlaying) {
        playPose($sprite, animation.name.replace(/-(left|right)$/, ''));
    }
}

export function defineAnimations(character) {
    let $sprite = character.getSprite();

    ['right', 'left'].forEach((facing) => {
        let frames = (list) => list.map((index) => frameOf(index, facing));

        $sprite.animations.add(`standing-${facing}`, frames(FRAMES.STANDING), 4, true);

        [['boxing', FRAMES.PUNCH], ['kicking', FRAMES.KICK]].forEach(([name, list]) => {
            let blow = $sprite.animations.add(`${name}-${facing}`, frames(list), 8, false);

            blow.onStart.add(() => setReach($sprite, true));
            blow.onComplete.add(() => {
                setReach($sprite, false);

                if ($sprite.alive) {
                    playPose($sprite, 'standing');
                }
            });
        });

        $sprite.animations.add(`win-${facing}`, frames(FRAMES.WIN), 4, true);

        let died = $sprite.animations.add(`died-${facing}`, frames(FRAMES.HURT), 4, true);
        died.onStart.add(() => layDown($sprite));
    });
}

/**
 * Puts a defeated character flat on the back, inside the visible area.
 *
 * @param {Phaser.Sprite} $sprite
 */
function layDown($sprite) {
    let bounds = $sprite.game.world.bounds;
    let isFacingRight = $sprite.facing === 'right';

    // Physics would keep pushing the rotated sprite around.
    $sprite.body.enable = false;

    // The back lies on the ground, the head away from the rival.
    $sprite.anchor.setTo(isFacingRight ? BACK_EDGE : 1 - BACK_EDGE, 1);
    $sprite.angle = isFacingRight ? -90 : 90;
    $sprite.y = bounds.bottom;
    $sprite.x = isFacingRight
        ? Phaser.Math.clamp($sprite.x + FRAME_HEIGHT / 2, FRAME_HEIGHT, bounds.right)
        : Phaser.Math.clamp($sprite.x - FRAME_HEIGHT / 2, bounds.left, bounds.right - FRAME_HEIGHT);
}

/**
 * How much health a blow takes: each time the attacker is 10 times
 * stronger than the defender, the blow is twice as strong.
 *
 * @param {number} points Strength of the blow between equal fighters.
 * @param {Character} attacker
 * @param {Character} defender
 * @returns {number}
 */
export function getBlowStrength(points, attacker, defender) {
    let tenfolds = Math.log10(attacker.getPower() / defender.getPower());
    let factor = Math.pow(POWER.DAMAGE_PER_TENFOLD, tenfolds);

    factor = Phaser.Math.clamp(factor, POWER.MIN_DAMAGE_FACTOR, POWER.MAX_DAMAGE_FACTOR);

    // Forms make blows stronger also beyond the limit above.
    let saiyanForm = attacker.getSaiyanForm();

    if (saiyanForm) {
        factor *= saiyanForm.blow;
    }

    if (attacker.forms.kaioken) {
        factor *= POWER.KAIOKEN.blow;
    }

    return Math.max(1, Math.round(points * factor));
}

/**
 * The energy wave flies at the height of the chest: it misses somebody
 * who dodges, who is in the air, or who is behind the attacker.
 *
 * @param {Phaser.Sprite} $attacker
 * @param {Phaser.Sprite} $target
 * @returns {boolean}
 */
export function canWaveHit($attacker, $target) {
    let direction = $attacker.facing === 'right' ? 1 : -1;
    let isInFront = ($target.x - $attacker.x) * direction > 0;

    return isInFront && !$target.isDodging && $target.body.onFloor();
}

/**
 * Is the target close enough in front of the attacker to be hit by a blow?
 * Measured from the positions, because the physics body grows in front
 * of the attacker only in the next frame.
 *
 * @param {Phaser.Sprite} $attacker
 * @param {Phaser.Sprite} $target
 * @returns {boolean}
 */
export function isInReach($attacker, $target) {
    let direction = $attacker.facing === 'right' ? 1 : -1;
    let distance = ($target.x - $attacker.x) * direction;

    return distance > -BEHIND_REACH && distance < FIGHT.BLOW_REACH && Math.abs($target.y - $attacker.y) < FIGHT.BLOW_HEIGHT;
}

export function resetCharacterVelocity($sprite) {
    $sprite.body.velocity.x = 0;
    // Falling is faster than rising.
    $sprite.body.velocity.y += $sprite.body.velocity.y > 0 ? FIGHT.FALL_SPEED * FIGHT.FALL_FACTOR : FIGHT.FALL_SPEED;
}

/**
 * @param {number} value
 * @returns {string} For example "3 000 000".
 */
export function formatPower(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * A short power level for the bar of a fight, for example "3 mln".
 *
 * @param {number} value
 * @param {Object} units Names of a million and a billion.
 * @returns {string}
 */
export function formatShortPower(value, units) {
    let short = (amount, unit) => `${String(Math.round(amount * 10) / 10).replace('.', units.decimal)} ${unit}`;

    if (value >= 1e9) {
        return short(value / 1e9, units.billion);
    }

    if (value >= 1e6) {
        return short(value / 1e6, units.million);
    }

    return formatPower(value);
}

export default class FightState extends Phaser.State {
    options = {
        player: {
            hp: null,
            exp: null,
            power: null,
            avatar: null
        },
        enemy: {
            hp: null,
            exp: null,
            power: null,
            avatar: null
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

    _addAvatar(x, y, key) {
        return this.add.image(x, y, key);
    }

    /**
     * The avatar of the player shows the Saiyan form in use.
     */
    _updateAvatar() {
        let player = this.game.player;
        let $avatar = this.options.player.avatar;

        if ($avatar) {
            $avatar.loadTexture(player.forms.saiyan ? `${player.id}-${player.forms.saiyan}-avatar` : `${player.id}-avatar`);
        }
    }

    _addBar(x, y, key, anchor = [0, 0]) {
        let blank = this.add.image(x, y, 'bar-blank');
        let color = this.add.image(x, y, key);

        blank.anchor.setTo(...anchor);
        color.anchor.setTo(...anchor);

        return { blank, color };
    }

    /**
     * @param {number} x Middle of the character.
     * @param {number} y Ground under the character.
     * @param {Character} character
     * @param {string} facing "right" or "left".
     */
    _setupSprite(x, y, character, facing) {
        let key = fightSpriteOf(this.game, character);

        // Glows behind the character, visible in a form: Kaioken has
        // a second, much bigger one. They are wider silhouettes, not scaled
        // copies, so their pixels match the rest.
        let addAura = (name) => {
            let $glow = this.add.sprite(x, y, `${character.id}-${name}`);
            $glow.anchor.setTo(0.5, 1);
            $glow.visible = false;
            return $glow;
        };
        let $outerAura = addAura('big-aura');
        let $aura = addAura('aura');
        $aura.$outer = $outerAura;

        character.createSprite(this, x, y, key);

        let $sprite = character.getSprite();
        $sprite.anchor.setTo(0.5, 1);
        $sprite.smoothed = false;
        $sprite.isDodging = false;
        $sprite.isReaching = false;
        $sprite.$aura = $aura;

        // Tutaj tworzymy ciało dla naszej postaci.
        this.physics.arcade.enable($sprite);

        // No bouncing off the ground: a character must be able to dodge
        // right after landing.
        $sprite.body.bounce.setTo(0.9, 0);
        $sprite.body.collideWorldBounds = true;

        $sprite.facing = facing;
        setReach($sprite, false);
        defineAnimations(character);
        playPose($sprite, 'standing');

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
            if (!$sprite.body.onFloor() || $sprite.isDodging) {
                return;
            }

            $sprite.body.velocity.y -= FIGHT.JUMP;
            this.game.music.playSound('jump');
        });

        $sprite.events.onKicking = new Phaser.Signal();
        // A new blow only after the previous one: no mashing through.
        $sprite.events.onKicking.add(() => {
            // Listeners check this flag: was the press a new blow?
            $sprite.isNewBlow = !$sprite.isDodging && !$sprite.isReaching;

            if (!$sprite.isNewBlow) {
                return;
            }

            playPose($sprite, 'kicking');
            this.game.music.playSound('kick');
        });

        $sprite.events.onBoxing = new Phaser.Signal();
        $sprite.events.onBoxing.add(() => {
            $sprite.isNewBlow = !$sprite.isDodging && !$sprite.isReaching;

            if (!$sprite.isNewBlow) {
                return;
            }

            playPose($sprite, 'boxing');
            this.game.music.playSound('punch');
        });

        $sprite.events.onWave = new Phaser.Signal();
        $sprite.events.onDied = new Phaser.Signal();
    }

    _updatePower(who) {
        let character = this.game[who];
        let $label = this.options[who].power;

        if (!$label) {
            return;
        }

        let forms = character.forms;
        $label.setText(`${this.game.locale.POWER} ${formatShortPower(character.getPower(), this.game.locale.POWER_UNITS)}`);
        $label.fill = forms.kaioken ? '#ff6a5a' : forms.saiyan ? '#ffe600' : '#fff';
    }

    _setupKeyboard() {
        let $player = this.game.player.getSprite();

        let keys = {
            [Phaser.Keyboard.V]: () => $player.events.onWave.dispatch(),
            [Phaser.Keyboard.C]: () => $player.events.onKicking.dispatch(),
            [Phaser.Keyboard.X]: () => $player.events.onBoxing.dispatch(),
            [Phaser.Keyboard.UP]: () => $player.events.onJumping.dispatch(),
            [Phaser.Keyboard.SPACEBAR]: () => $player.events.onJumping.dispatch(),
            [Phaser.Keyboard.S]: () => this._nextSaiyanForm(),
            [Phaser.Keyboard.K]: () => this._toggleKaioken()
        };

        // Wstrzymujemy propagację zdarzeń w oknie przeglądarki.
        this.input.keyboard.addKeyCapture(Object.keys(keys).map(Number).concat(Phaser.Keyboard.DOWN));

        Object.keys(keys).forEach((code) => {
            this.input.keyboard.addKey(Number(code)).onDown.add(keys[code]);
        });
    }

    _setupEnemy() {
        // Współdzielimy obiekt wroga między stana w grze.
        this.game.enemy = new Enemy();

        // Pobieramy pierwszego wroga. Każde zwycięstwo eliminuje pierwszego z listy.
        this.game.enemy.setPersonality(this.game.rivals[0]);

        // With several rivals in a round, each one is weaker.
        if (ROUNDS[this.game.round].gauntlet) {
            this.game.enemy.hp = FIGHT.TOURNAMENT_HP;
        }
    }

    create() {
        Object.assign(this, OptionsEnemyMixin, OptionsPlayerMixin);

        this.game.player.resetForms();

        this._setupWorld();
        this._setupEnemy();

        // Every rival is fought in their own place; in the tournament
        // everybody fights in the ring.
        addBackground(this, ROUNDS[this.game.round].isTournament ? 'bg-tournament' : this.game.enemy.background);

        this._setupSprite(225, 360, this.game.player, 'right');
        this._setupSprite(575, 360, this.game.enemy, 'left');

        this._setupPlayerOptions();
        this._setupEnemyOptions();

        this._setupFight();
        this._setupKeyboard();
        this._setupFormDrain();

        this.displayLogo();
        // With several rivals, each one is announced by the name.
        let isGauntlet = Boolean(ROUNDS[this.game.round].gauntlet);
        displayTitleMessage(this.game, isGauntlet ? this.game.enemy.title : this.game.locale.FIGHT_STATE_WELCOME);
    }

    update() {
        let $enemy = this.game.enemy.getSprite();
        let $player = this.game.player.getSprite();
        this.physics.arcade.collide($enemy, $player);
        resetCharacterVelocity($enemy);
        resetCharacterVelocity($player);
        this._handleKeyboard();
        this._faceEachOther($player, $enemy);
        this._updatePose($enemy);
        this._updatePose($player);
        this._updateAura(this.game.player);
    }

    /**
     * Fighters always look at each other, also after a jump over the rival.
     */
    _faceEachOther($player, $enemy) {
        [[$player, $enemy], [$enemy, $player]].forEach(([$sprite, $other]) => {
            if ($sprite.alive && !$sprite.isReaching) {
                setFacing($sprite, $other.x > $sprite.x ? 'right' : 'left');
            }
        });
    }

    _setupFight() {
        let context = this;
        let player = this.game.player;
        let enemy = this.game.enemy;
        let $player = player.getSprite();
        let $enemy = enemy.getSprite();


        // Pushes the hit one away from the attacker.
        function knockBack($target, $attacker) {
            $target.body.velocity.x += Math.sign($target.x - $attacker.x || 1) * FIGHT.HORIZONTAL_SPEED * 4;
        }

        function handlePlayerBlow(points) {
            // Nobody attacks from a dodge and nobody gets hit in it.
            if ($player.isDodging || $enemy.isDodging || !$player.isNewBlow) {
                return;
            }

            if (isInReach($player, $enemy)) {
                context.game.music.playSound('hit');
                context._addPlayerEXP(points * 1.75);
                context._removeEnemyHP(getBlowStrength(points, player, enemy));
                knockBack($enemy, $player);
            }
        }

        $player.events.onKicking.add(() => handlePlayerBlow(FIGHT.KICKING_POINTS));
        $player.events.onBoxing.add(() => handlePlayerBlow(FIGHT.BOXING_POINTS));
        $player.events.onWave.add(() => {
            if (this._showWave(player) && canWaveHit($player, $enemy)) {
                context.game.music.playSound('hit');
                context._addPlayerEXP(FIGHT.WAVE_POINTS * 1.75);
                context._removeEnemyHP(getBlowStrength(FIGHT.WAVE_POINTS, player, enemy));
                knockBack($enemy, $player);
            }
        });
        $player.events.onDied.add(() => this._finishFight('died', 'win'));

        function handleEnemyBlow(points) {
            if ($player.isDodging || $enemy.isDodging || !$enemy.isNewBlow) {
                return;
            }

            if (isInReach($enemy, $player)) {
                context.game.music.playSound('hit');
                context._addEnemyEXP(points);
                context._removePlayerHP(getBlowStrength(points, enemy, player));
                knockBack($player, $enemy);
            }
        }

        $enemy.events.onKicking.add(() => handleEnemyBlow(FIGHT.KICKING_POINTS));
        $enemy.events.onBoxing.add(() => handleEnemyBlow(FIGHT.BOXING_POINTS));
        $enemy.events.onWave.add(() => {
            if (this._showWave(enemy) && canWaveHit($enemy, $player)) {
                context.game.music.playSound('hit');
                context._addEnemyEXP(FIGHT.WAVE_POINTS);
                context._removePlayerHP(getBlowStrength(FIGHT.WAVE_POINTS, enemy, player));
                knockBack($player, $enemy);
            }
        });
        $enemy.events.onDied.add(() => this._finishFight('win', 'died'));

        ArtificialIntelligence.setup(this, $enemy);
    }

    /**
     * Switches a Saiyan to the next form: Super Saiyan, 2, 3, God, Blue
     * (as far as the character can go), and back to the normal one.
     */
    _nextSaiyanForm() {
        let player = this.game.player;
        let $player = player.getSprite();
        let texts = this.game.locale.FORMS;
        let forms = player.getAvailableSaiyanForms();

        if (!$player.alive) {
            return;
        }

        if (forms.length === 0) {
            displaySingleLineMessage(this.game, texts.onlySaiyans);
            return;
        }

        let index = forms.findIndex((form) => form.name === player.forms.saiyan);
        let next = forms[index + 1] || null;

        if (next && player.hp <= POWER.MIN_FORM_HP) {
            displaySingleLineMessage(this.game, texts.tooWeak);
            return;
        }

        player.forms.saiyan = next ? next.name : null;
        $player.loadTexture(fightSpriteOf(this.game, player), $player.frame, false);
        this._updateAvatar();

        if (next) {
            this.game.music.playSound('transform');
            this.camera.flash(AURA_TINTS[next.name], 200);
            displaySingleLineMessage(this.game, texts[next.name]);
        }

        this._updatePower('player');
    }

    /**
     * Turns Kaioken on or off: everybody can use it.
     */
    _toggleKaioken() {
        let player = this.game.player;
        let texts = this.game.locale.FORMS;

        if (!player.getSprite().alive) {
            return;
        }

        if (!player.forms.kaioken && player.hp <= POWER.MIN_FORM_HP) {
            displaySingleLineMessage(this.game, texts.tooWeak);
            return;
        }

        player.forms.kaioken = !player.forms.kaioken;

        if (player.forms.kaioken) {
            this.game.music.playSound('transform');
            this.camera.flash(AURA_TINTS.kaioken, 200);
            displaySingleLineMessage(this.game, texts.kaioken);
        }

        this._updatePower('player');
    }

    _endForms() {
        let player = this.game.player;
        let $player = player.getSprite();
        let hadSaiyanForm = Boolean(player.forms.saiyan);

        player.resetForms();

        if (hadSaiyanForm && $player.alive) {
            $player.loadTexture(fightSpriteOf(this.game, player), $player.frame, false);
            this._updateAvatar();
        }

        this._updatePower('player');
    }

    /**
     * Every second a form takes health; it ends when the health is low.
     */
    _setupFormDrain() {
        this.time.events.loop(Phaser.Timer.SECOND, () => {
            let player = this.game.player;
            let saiyanForm = player.getSaiyanForm();
            let drain = (saiyanForm ? saiyanForm.drain : 0) + (player.forms.kaioken ? POWER.KAIOKEN.drain : 0);

            if (drain === 0 || !player.getSprite().alive) {
                return;
            }

            player.hp = Math.max(1, player.hp - drain);
            this._updatePlayerOptionsHP();

            if (player.hp <= POWER.MIN_FORM_HP) {
                this._endForms();
                displaySingleLineMessage(this.game, this.game.locale.FORMS.exhausted);
            }
        });
    }

    _updateAura(character) {
        let $sprite = character.getSprite();
        let $aura = $sprite.$aura;
        let $outer = $aura.$outer;
        let forms = character.forms;
        let pulse = Math.sin(this.time.now / 90);

        $aura.visible = $sprite.alive && Boolean(forms.saiyan || forms.kaioken);
        $outer.visible = $sprite.alive && forms.kaioken;

        [$aura, $outer].forEach(($glow) => {
            if (!$glow.visible) {
                return;
            }

            $glow.frame = $sprite.frame;
            $glow.x = $sprite.x;
            $glow.y = $sprite.y + AURA_DROP;
        });

        if (!$aura.visible) {
            return;
        }

        $aura.tint = forms.kaioken ? AURA_TINTS.kaioken : AURA_TINTS[forms.saiyan];
        $aura.alpha = 0.75 + 0.2 * pulse;

        if ($outer.visible) {
            $outer.tint = AURA_TINTS.kaioken;
            $outer.alpha = 0.35 + 0.15 * pulse;
        }
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
        let $player = player.getSprite();
        let enemy = this.game.enemy;
        let $enemy = enemy.getSprite();

        let time = Phaser.Timer.SECOND * 2.5;
        let label = `${player.title} ${this._getLocaleStatus(playerState)}`;
        displaySingleLineMessage(this.game, label);

        // Wyłączamy wsparcie klawiatury w grze.
        this.input.keyboard.enabled = false;

        // The fight is over: no more moves or blows, also the ones
        // already scheduled by the artificial intelligence.
        [$player, $enemy].forEach(($sprite) => {
            ['onLeft', 'onRight', 'onJumping', 'onKicking', 'onBoxing', 'onWave', 'onDied'].forEach((name) => {
                $sprite.events[name].removeAll();
            });
        });

        // Sprowadzamy postacie na ziemie.
        $player.body.velocity.setTo(0, 0);
        $enemy.body.velocity.setTo(0, 0);

        // Włączamy animacje: zwycięstwa i porażki.
        playPose($player, playerState);
        playPose($enemy, enemyState);

        // Uśmiercam obu, aby żadne animacje nie były więcej wykonywane.
        // Nie używamy .kill() bo wtedy nie wykona się ost. animacja
        // (zwycięstwa albo porażki).
        $player.alive = false;
        $enemy.alive = false;

        utils.timeout(this, time, () => {
            // Przywracamy wsparcie klawiatury w grze.
            this.input.keyboard.enabled = true;
            player.resetForms();

            if (playerState === 'died') {
                this.game.emit('game:over', { enemy: this.game.enemy });
            } else {
                // Usuwamy pierwszego, pokonanego wroga.
                this.game.rivals.shift();
                this.game.emit('enemy:killed', {
                    enemy: this.game.enemy,
                    summary: [
                        { label: 'rival', value: this.game.enemy.title },
                        { label: 'rivalPower', value: formatPower(this.game.enemy.getPower()) }
                    ]
                });
            }
        });
    }

    _handleKeyboard() {
        let $player = this.game.player.getSprite();
        let keyboard = this.input.keyboard;

        // A dodge: only on the ground, and nothing else can be done in it.
        $player.isDodging = $player.alive && keyboard.isDown(Phaser.Keyboard.DOWN) && $player.body.onFloor();

        if ($player.isDodging) {
            return;
        }

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            $player.events.onLeft.dispatch();
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            $player.events.onRight.dispatch();
        }
    }

    /**
     * Fires the energy wave of a character to where it looks, if it is ready.
     *
     * @param {Character} character
     * @returns {boolean} False when the wave could not be fired.
     */
    _showWave(character) {
        let $sprite = character.getSprite();
        let direction = $sprite.facing === 'right' ? 1 : -1;

        if (!$sprite.alive || $sprite.isDodging || $sprite.isWaveCooling) {
            return false;
        }

        $sprite.isWaveCooling = true;
        this.time.events.add(FIGHT.WAVE_COOLDOWN, () => {
            $sprite.isWaveCooling = false;
        });

        // The frame with a stretched arm.
        playPose($sprite, 'boxing');
        this.game.music.playSound('wave');

        let $wave = this.add.image($sprite.x + direction * 30, $sprite.y - 112, 'beam');

        $wave.anchor.setTo(0, 0.5);
        // Turned to the left only by mirroring: the pixels keep their size.
        $wave.scale.setTo(direction, 1);
        $wave.tint = character.wave;
        this.time.events.add(FIGHT.WAVE_TIME, () => $wave.destroy());

        return true;
    }

    /**
     * Shows the jump and the dodge, which are single frames, not animations.
     *
     * @param {Phaser.Sprite} $sprite
     */
    _updatePose($sprite) {
        let animation = $sprite.animations.currentAnim;

        if (!$sprite.alive || $sprite.isReaching) {
            return;
        }

        if ($sprite.isDodging) {
            $sprite.animations.stop();
            $sprite.frame = frameOf(FRAMES.DODGE, $sprite.facing);
        } else if (!$sprite.body.onFloor()) {
            $sprite.animations.stop();
            $sprite.frame = frameOf(FRAMES.JUMP, $sprite.facing);
        } else if (!animation || !animation.isPlaying) {
            playPose($sprite, 'standing');
        }
    }
}
