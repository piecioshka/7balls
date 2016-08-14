let debug = {
    log: require('debug')('7balls:character:log')
};

let assign = require('lodash.assign');
let slug = require('slug');
let assert = require('assert');

let DEFAULT_ATTRIBUTES = {
    // Liczba żyć.
    up: 0,

    // Procent życia.
    hp: 100,

    // Liczba doświadczenia.
    exp: 0,

    // Poziom. Max = 100.
    lvl: 1
};

export default class Character {

    // Identyfikator użytkownika, np. goku, vegeta
    get id() {
        assert(typeof this.title === 'string', 'Character#id: title is not a string');
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
     * @returns {Phaser.Sprite}
     */
    createSprite(state, x, y, key) {
        return this._phaser = state.add.sprite(x, y, key);
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
