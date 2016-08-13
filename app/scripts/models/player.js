let debug = {
    log: require('debug')('7balls:character:log')
};

let assign = require('lodash.assign');

let defaultSettings = {
    // Identifier of character, ex. goku, vegeta
    id: 'unknown',

    // User put his favourite nickname.
    nickname: 'unknown',

    // Name of character: Son Goku or Vegeta.
    name: 'unknown'
};

let defaultNumbers = {
    // Number of lives.
    up: 0,

    // Percent of health. Decrease. When =0, up -1.
    hp: 100,

    // Number of skills. Increase. When =100, level +1 and reduce =0.
    exp: 0,

    // Number of level. Max lvl=100
    lvl: 1
};

export default class Character {
    static defaultSettings = defaultSettings;
    static defaultNumbers = defaultSettings;

    constructor(settings) {
        debug.log('new', settings);
        assign(this, defaultSettings, settings);
        assign(this, defaultNumbers, settings);
    }

    resetNumbers() {
        assign(this, defaultNumbers);
    }
}
