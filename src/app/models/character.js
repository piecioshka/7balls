let isString = require('lodash.isstring');
let { slug } = require('../helpers/utils');
let assert = require('assert');
const DEFAULT_ATTRIBUTES = require('../constants/character-attributes');
const POWER = require('../constants/power');

export default class Character {
    // Identyfikator użytkownika, np. goku, vegeta
    get id() {
        assert(isString(this.title));
        return slug(this.title).toLowerCase();
    }

    // Nazwa postaci, np. Son Goku, Vegeta.
    title = null;

    // TODO(piecioshka): użytkownik podaje swoją nazwę.
    nickname = null;

    // Base power level, as in the story.
    basePower = 1;

    // Forms which multiply the power and take health every second.
    forms = { saiyan: null, kaioken: false };

    // Tint of the energy wave.
    wave = 0xffffff;

    // Key of the landscape where the character is fought.
    background = null;

    /**
     * @type {?Phaser.Sprite}
     * @access private
     */
    _phaser = null;

    constructor() {
        Object.assign(this, DEFAULT_ATTRIBUTES);
        this.resetForms();
    }

    /**
     * @param {Phaser.State} state
     * @param {number} x
     * @param {number} y
     * @param {string} key
     */
    createSprite(state, x, y, key) {
        this._phaser = state.add.sprite(x, y, key);
    }

    /**
     * @returns {?Phaser.Sprite}
     */
    getSprite() {
        return this._phaser;
    }

    setPersonality(typeClass) {
        let type = new typeClass();
        // console.log(this.constructor.name + '#setPersonality', type);
        this.title = type.title;
        this.basePower = type.power;
        this.wave = type.wave;
        this.background = type.background;
    }

    resetHP() {
        this.hp = DEFAULT_ATTRIBUTES.hp;
    }

    resetForms() {
        this.forms = { saiyan: null, kaioken: false };
    }

    /**
     * @returns {?Object} The Saiyan form in use, see constants/power.js.
     */
    getSaiyanForm() {
        return POWER.SAIYAN_FORMS.find((form) => form.name === this.forms.saiyan) || null;
    }

    /**
     * Saiyan forms this character can use, from the weakest one.
     *
     * @returns {Object[]}
     */
    getAvailableSaiyanForms() {
        return POWER.SAIYAN_FORMS.filter((form) => form.ids.includes(this.id));
    }

    /**
     * Power level: the base one, raised by experience and by forms.
     *
     * @returns {number}
     */
    getPower() {
        let power = this.basePower * (1 + this.exp / POWER.EXP_PER_BASE_POWER);

        let saiyanForm = this.getSaiyanForm();

        if (saiyanForm) {
            power *= saiyanForm.multiplier;
        }

        if (this.forms.kaioken) {
            power *= POWER.KAIOKEN.multiplier;
        }

        return Math.round(power);
    }
}
