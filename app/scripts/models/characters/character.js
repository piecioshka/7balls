'use strict';

let debug = {
    log: require('debug')('7balls:character:log')
};

let assign = require('lodash.assign');

class Character {
    constructor(settings) {
        debug.log('new', settings);
        assign(this, Character.defaultSettings, settings);
        assign(this, Character.defaultNumbers, settings);
    }

    resetNumbers() {
        assign(this, Character.defaultNumbers);
    }

    static get defaultSettings() {
        return {

            // Identifier of character, ex. goku, vegeta
            id: 'unknown',

            // User put his favourite nickname.
            nickname: 'unknown',

            // Name of character: Son Goku or Vegeta.
            name: 'unknown'
        };
    }

    static get defaultNumbers() {
        return {

            // Number of lives.
            up: 0,

            // Percent of health. Decrease. When =0, up -1.
            hp: 100,

            // Number of skills. Increase. When =100, level +1 and reduce =0.
            exp: 0,

            // Number of level. Max lvl=100
            lvl: 1
        };
    }
}

export default Character;
