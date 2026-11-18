const DEFENSE = require('../../constants/defense');
const FIGHT = require('../../constants/fight');

import FightState, { setFacing, isInReach, resetCharacterVelocity, getBlowStrength } from './fight-state';
import Character from '../../models/character';
import SonGoku from '../../models/species/saiyans/son-goku';
import Vegeta from '../../models/species/saiyans/vegeta';

let { displaySingleLineMessage, addLabel } = require('../../helpers/message');
let { addBackground } = require('../../helpers/background');
let { FRAMES, frameOf } = require('../../helpers/sprites');
let OptionsPlayerMixin = require('../mixins/options-player-mixin');

const GROUND = 360;
// Cell Jr. as a defender of blows: only his power matters.
const CELL_JR = { getPower: () => DEFENSE.CELL_JR_POWER };
const HIT_TINT = 0xff8080;

/**
 * A wounded friend lies behind the player and Cell Jr. run to finish him
 * off. They take a few blows (fewer in a form), run through the player
 * (and hurt him), and some of them jump over him.
 */
export default class DefendFriendState extends FightState {
    isFinished = false;
    minions = null;
    friendHP = 0;
    left = 0;
    beaten = 0;
    $friendHP = null;
    $left = null;

    create() {
        Object.assign(this, OptionsPlayerMixin);

        this.isFinished = false;
        this.friendHP = DEFENSE.FRIEND_HP;
        this.left = DEFENSE.MINIONS;
        this.beaten = 0;
        this.game.player.resetForms();

        addBackground(this);
        this._setupWorld();
        this._setupFriend();
        this._setupSprite(300, GROUND, this.game.player, 'right');

        this.minions = this.add.group();
        this.minions.enableBody = true;

        this._setupPlayerOptions();
        this._setupLabels();
        this._setupBlows();
        this._setupKeyboard();
        this._setupFormDrain();

        this._scheduleMinions();
    }

    /**
     * The friend is the Saiyan who was not chosen by the player.
     */
    _setupFriend() {
        let friend = new Character();
        friend.setPersonality(this.game.player.id === 'vegeta' ? SonGoku : Vegeta);

        let $friend = this.add.sprite(DEFENSE.FRIEND_EDGE - 10, GROUND, `${friend.id}-fight`, frameOf(FRAMES.HURT[0], 'right'));
        $friend.anchor.setTo(0.12, 1);
        $friend.angle = -90;
    }

    _setupLabels() {
        this.$friendHP = addLabel(this.game, this.game.width - 12, 12, '', [1, 0]);
        this.$left = addLabel(this.game, this.game.width - 12, 40, '', [1, 0]);
        this._updateLabels();
    }

    _updateLabels() {
        let locale = this.game.locale.DEFEND_FRIEND;

        this.$friendHP.setText(`${locale.friend}: ${this.friendHP}`);
        this.$left.setText(`Cell Jr: ${this.left}`);
    }

    _setupBlows() {
        let $player = this.game.player.getSprite();
        let hit = (points) => {
            // The blow did not start: the previous one is still going on.
            if (!$player.isNewBlow) {
                return;
            }

            this.minions.children.slice().forEach(($minion) => {
                // A Cell Jr. in the air can be hit only from a jump.
                let isOutOfReach = $minion.fall !== 0 && $player.body.onFloor();

                if ($minion.alive && !isOutOfReach && isInReach($player, $minion)) {
                    this._hitMinion($minion, points);
                }
            });
        };

        // The energy wave hits everybody close enough in front.
        $player.events.onWave.add(() => {
            if (!this._showWave(this.game.player)) {
                return;
            }

            let direction = $player.facing === 'right' ? 1 : -1;

            this.minions.children.slice().forEach(($minion) => {
                let distance = ($minion.x - $player.x) * direction;

                if ($minion.alive && distance > 0 && distance < DEFENSE.WAVE_RANGE) {
                    this._hitMinion($minion, FIGHT.WAVE_POINTS);
                }
            });
        });

        $player.events.onDied.add(() => {
            this._finish('game:over', `${this.game.player.title} ${this.game.locale.FIGHT_STATE_PLAYER_DIED}`);
        });

        $player.events.onKicking.add(() => hit(FIGHT.KICKING_POINTS));
        $player.events.onBoxing.add(() => hit(FIGHT.BOXING_POINTS));
    }

    /**
     * Cell Jr. come one by one, and sometimes two right after each other.
     */
    _scheduleMinions() {
        let time = 0;

        for (let index = 0; index < DEFENSE.MINIONS; index++) {
            let isPair = index > 0 && this.rnd.frac() < DEFENSE.PAIRS;
            time += isPair ? DEFENSE.PAIR_GAP : DEFENSE.MINION_INTERVAL;
            this.time.events.add(time, this._addMinion, this);
        }
    }

    _addMinion() {
        if (this.isFinished) {
            return;
        }

        let $minion = this.minions.create(this.game.width + 50, GROUND, 'cell-jr-fight', frameOf(FRAMES.STANDING[0], 'left'));

        $minion.anchor.setTo(0.5, 1);
        $minion.smoothed = false;
        $minion.hp = DEFENSE.MINION_HP;
        $minion.speed = this.rnd.between(DEFENSE.MINION_MIN_SPEED, DEFENSE.MINION_MAX_SPEED);
        $minion.animations.add('running', FRAMES.STANDING.map((index) => frameOf(index, 'left')), 8, true).play();
        $minion.body.allowGravity = false;
        $minion.body.setSize(60, 120, 45, 80);
        $minion.body.velocity.x = -$minion.speed;
        // Some of them jump over the player.
        $minion.isLeaper = this.rnd.frac() < DEFENSE.LEAPERS;
        $minion.hasLeaped = false;
        $minion.hasBumped = false;
        $minion.fall = 0;
    }

    /**
     * A blow pushes a Cell Jr. back; the last one drives him away.
     * Like in a fight, the strength depends on the power: forms help.
     */
    _hitMinion($minion, points) {
        $minion.hp -= getBlowStrength(points, this.game.player, CELL_JR);
        this.game.music.playSound('hit');

        if ($minion.hp > 0) {
            $minion.tint = HIT_TINT;
            $minion.body.velocity.x = DEFENSE.KNOCK_BACK;
            this.time.events.add(200, () => {
                if ($minion.alive) {
                    $minion.tint = 0xffffff;
                    $minion.body.velocity.x = -$minion.speed;
                }
            });
            return;
        }

        this._knockOut($minion, points);
    }

    /**
     * A beaten Cell Jr. flies away over the right edge of the screen.
     */
    _knockOut($minion, points) {
        $minion.alive = false;
        $minion.body.velocity.setTo(700, -250);
        $minion.angle = 45;
        this.time.events.add(Phaser.Timer.SECOND, () => $minion.destroy());

        this._addPlayerEXP(points * 3);
        this.game.music.playSound('hit');
        this.beaten++;
        this._removeMinion();
    }

    _removeMinion() {
        this.left--;
        this._updateLabels();

        if (this.left === 0 && this.friendHP > 0) {
            this._finish('game:friend-saved', this.game.locale.DEFEND_FRIEND.saved);
        }
    }

    _hurtFriend($minion) {
        $minion.alive = false;
        $minion.destroy();
        this.camera.flash(0xff0000, 200);
        this.game.music.playSound('hurt');

        this.friendHP = Math.max(0, this.friendHP - DEFENSE.MINION_DAMAGE);

        if (this.friendHP === 0) {
            this._updateLabels();
            this._finish('game:over', this.game.locale.DEFEND_FRIEND.lost);
            return;
        }

        this._removeMinion();
    }

    /**
     * A Cell Jr. runs through the player and hurts him on the way.
     */
    _hurtPlayer($minion) {
        let $player = this.game.player.getSprite();

        if (this.isFinished || $player.isDodging || $minion.hasBumped) {
            return;
        }

        $minion.hasBumped = true;
        this.game.music.playSound('hurt');
        this._removePlayerHP(DEFENSE.CONTACT_DAMAGE);
    }

    /**
     * A jump over the player: up, and down again to the ground.
     */
    _moveLeaper($minion, $player) {
        let distance = $minion.x - $player.x;

        if ($minion.isLeaper && !$minion.hasLeaped && distance > 0 && distance < DEFENSE.LEAP_DISTANCE) {
            $minion.hasLeaped = true;
            $minion.fall = -DEFENSE.LEAP_SPEED;
            $minion.frame = frameOf(FRAMES.JUMP, 'left');
            $minion.animations.stop();
        }

        if ($minion.fall === 0 && $minion.y >= GROUND) {
            return;
        }

        $minion.fall += DEFENSE.LEAP_GRAVITY;
        $minion.body.velocity.y = $minion.fall;

        if ($minion.y >= GROUND && $minion.fall > 0) {
            $minion.y = GROUND;
            $minion.fall = 0;
            $minion.body.velocity.y = 0;
            $minion.play('running');
        }
    }

    _finish(eventName, text) {
        if (this.isFinished) {
            return;
        }

        this.isFinished = true;
        this.input.keyboard.enabled = false;
        displaySingleLineMessage(this.game, text);

        this.time.events.add(Phaser.Timer.SECOND * 2, () => {
            this.input.keyboard.enabled = true;
            this.game.emit(eventName, {
                enemy: null,
                summary: [
                    { label: 'beaten', value: `${this.beaten} / ${DEFENSE.MINIONS}` },
                    { label: 'friend', value: `${this.friendHP} / ${DEFENSE.FRIEND_HP}` }
                ]
            });
        });
    }

    update() {
        let $player = this.game.player.getSprite();
        let keyboard = this.input.keyboard;

        resetCharacterVelocity($player);

        if (!this.isFinished) {
            this._handleKeyboard();

            // The player looks where he goes.
            if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
                setFacing($player, 'left');
            } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                setFacing($player, 'right');
            }
        }

        this._updatePose($player);
        this._updateAura(this.game.player);

        this.minions.children.slice().forEach(($minion) => {
            if (!$minion.alive) {
                return;
            }

            this._moveLeaper($minion, $player);

            if ($minion.x < DEFENSE.FRIEND_EDGE) {
                this._hurtFriend($minion);
            } else if (this.physics.arcade.overlap($player, $minion) && !$player.isReaching) {
                this._hurtPlayer($minion);
            }
        });
    }
}
