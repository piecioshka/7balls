class Character {
    constructor(settings) {
        Object.assign(this, Character.defaultSettings, settings);
    }

    static get defaultSettings() {
        return {
            // User put his favourite nickname.
            nickname: 'unknown',
            // Name of character: Son Goku or Vegeta.
            name: 'unknown',
            // Number of lives.
            up: 0,
            // Percent of health.
            hp: 100,
            // List of skills.
            exp: [],
            // Number of level.
            lvl: 1
        };
    }
}

export default Character;
