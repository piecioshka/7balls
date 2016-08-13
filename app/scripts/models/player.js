let debug = {
    log: require('debug')('7balls:character:log')
};

let assign = require('lodash.assign');

let defaultSettings = {
    // Identyfikator użytkownika, np. goku, vegeta
    id: 'unknown',

    // Użytkownik podaje swoją nazwę.
    nickname: 'unknown',

    // Nazwa postaci, np. Son Goku, Vegeta.
    name: 'unknown'
};

let defaultNumbers = {
    // Liczba żyć.
    up: 0,

    // Procent życia.
    hp: 100,

    // Liczba doświadczenia.
    exp: 0,

    // Poziom. Max = 100.
    lvl: 1
};

export default class Player {
    static defaultSettings = defaultSettings;
    static defaultNumbers = defaultSettings;

    /**
     * @type {?Phaser.Sprite}
     */
    phaser = null;

    /**
     * @param settings
     * @param {Phaser.Game} settings.game
     */
    constructor(settings) {
        debug.log('new', settings);
        assign(this, defaultSettings, settings);
        assign(this, defaultNumbers, settings);
    }

    resetNumbers() {
        assign(this, defaultNumbers);
    }
}
