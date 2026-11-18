const TRAINING = require('../../constants/training');

import FightState, { resetCharacterVelocity } from './fight-state';
import Character from '../../models/character';
import Whis from '../../models/species/monsters/whis';

let { displaySingleLineMessage, addLabel } = require('../../helpers/message');
let { addBackground } = require('../../helpers/background');
let OptionsPlayerMixin = require('../mixins/options-player-mixin');
let { FRAMES, frameOf } = require('../../helpers/sprites');

// Frames of Whis, who looks to the left: a stretched arm and a stretched leg.
const HIGH_ATTACK_FRAME = frameOf(FRAMES.PUNCH[1], 'left');
const LOW_ATTACK_FRAME = frameOf(FRAMES.KICK[1], 'left');
const GREEN = '#7dff6a';
const RED = '#ff5a5a';

/**
 * Training with Whis. He attacks high or low and shows it a moment earlier:
 * a high attack has to be dodged (arrow down), a low one jumped over.
 * Avoiding enough attacks passes the round and gives a level.
 */
export default class WhisTrainingState extends FightState {
    isFinished = false;
    avoided = 0;
    attacks = 0;
    $whis = null;
    $cue = null;
    $score = null;

    create() {
        Object.assign(this, OptionsPlayerMixin);

        this.isFinished = false;
        this.avoided = 0;
        this.attacks = 0;

        // Whis trains on the planet of Beerus.
        addBackground(this, 'bg-beerus');
        this._setupWorld();
        this._setupWhis();

        this.game.player.resetForms();
        this._setupSprite(330, 360, this.game.player, 'right');

        this._setupPlayerOptions();
        this._setupKeyboard();
        this._setupFormDrain();

        this.$score = addLabel(this.game, this.game.width - 12, 12, '', [1, 0]);
        this._updateScore();

        this.$cue = addLabel(this.game, this.game.world.centerX, 150, '', [0.5, 0.5]);

        this.time.events.repeat(TRAINING.INTERVAL, TRAINING.ATTACKS, this._attack, this);
    }

    _setupWhis() {
        let whis = new Character();
        whis.setPersonality(Whis);

        this.$whis = this.add.sprite(500, 360, `${whis.id}-fight`, 0);
        this.$whis.anchor.setTo(0.5, 1);
        this.$whis.smoothed = false;
        this.$whis.animations.add('standing', FRAMES.STANDING.map((index) => frameOf(index, 'left')), 4, true).play();
    }

    _updateScore() {
        this.$score.setText(`${this.game.locale.TRAINING.score}: ${this.avoided} / ${TRAINING.ATTACKS}`);
    }

    /**
     * Whis announces an attack and strikes after the time to react.
     */
    _attack() {
        if (this.isFinished) {
            return;
        }

        let locale = this.game.locale.TRAINING;
        let isHigh = this.rnd.frac() < 0.5;

        this.$cue.fill = '#fff';
        this.$cue.setText(isHigh ? `↓ ${locale.dodge}` : `↑ ${locale.jump}`);
        this.game.music.playSound('select');

        this.time.events.add(TRAINING.REACTION, () => this._strike(isHigh));
    }

    _strike(isHigh) {
        let $player = this.game.player.getSprite();
        let locale = this.game.locale.TRAINING;
        // A high blow passes over a dodge, a low one under a jump.
        let isAvoided = isHigh ? $player.isDodging : !$player.body.onFloor();

        this.$whis.animations.stop();
        this.$whis.frame = isHigh ? HIGH_ATTACK_FRAME : LOW_ATTACK_FRAME;
        this.time.events.add(300, () => this.$whis.play('standing'));

        this.attacks++;

        if (isAvoided) {
            this.avoided++;
            this.$cue.fill = GREEN;
            this.$cue.setText(locale.good);
            this.game.music.playSound('confirm');
        } else {
            this.$cue.fill = RED;
            this.$cue.setText(locale.bad);
            this.game.music.playSound('hurt');
            this.camera.flash(0xff0000, 150);
        }

        this._updateScore();

        if (this.attacks === TRAINING.ATTACKS) {
            this._finish();
        }
    }

    _finish() {
        let isPassed = this.avoided >= TRAINING.REQUIRED;
        let locale = this.game.locale.TRAINING;
        let player = this.game.player;

        this.isFinished = true;
        this.input.keyboard.enabled = false;
        displaySingleLineMessage(this.game, isPassed ? locale.passed : locale.failed);

        if (isPassed) {
            player.exp += TRAINING.REWARD;
            this._updatePlayerOptionsEXP();
            this._updatePower('player');
        }

        this.time.events.add(Phaser.Timer.SECOND * 2, () => {
            this.input.keyboard.enabled = true;

            if (isPassed) {
                this.game.emit('game:training-completed', {
                    summary: [{ label: 'avoided', value: `${this.avoided} / ${TRAINING.ATTACKS}` }]
                });
            } else {
                this.game.emit('game:over', { enemy: null });
            }
        });
    }

    update() {
        let $player = this.game.player.getSprite();

        resetCharacterVelocity($player);

        if (!this.isFinished) {
            this._handleKeyboard();
        }

        this._updatePose($player);
        this._updateAura(this.game.player);
    }
}
