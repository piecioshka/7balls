let debug = {
    log: require('debug')('7balls:character:log')
};

let assign = require('lodash.assign');
let isString = require('lodash.isstring');
let { slug } = require('../helpers/utils');
let assert = require('assert');
const DEFAULT_ATTRIBUTES = require('../constants/character-attributes');

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

    /**
     * @type {?Phaser.Sprite}
     * @access private
     */
    _phaser = null;

    constructor() {
        assign(this, DEFAULT_ATTRIBUTES);
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
        console.log(this.constructor.name + '#setPersonality', type);
        this.title = type.title;
    }

    resetHP() {
        this.hp = DEFAULT_ATTRIBUTES.hp;
    }
}
