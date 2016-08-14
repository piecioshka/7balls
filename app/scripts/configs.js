let pkg = require('../../package.json');

module.exports = {
    GAME_WIDTH: 800,
    GAME_HEIGHT: 400,
    GAME_RENDER_ID: 'game-area',

    STORAGE_AUDIO_KEY: `${pkg.name}-sound-mute`,

    PLAYER_MAXIMUM_EXPERIENCE: 100,
    PLAYER_MAXIMUM_LEVEL: 100,

    COLLECTING_PLAYER_SPEED: 300,
    COLLECTING_MAPS_TIME_LIMIT: [15, 20, 30],

    FIGHT_BOTTOM_MARGIN: 40,
    FIGHT_HORIZONTAL_SPEED: 300,
    FIGHT_JUMP: 500,
    FIGHT_FALL_SPEED: 12,
    FIGHT_LEVELS_THRESHOLD: [30, 60],
    FIGHT_CHARACTER_AVATAR_WIDTH: 50,
    FIGHT_CHARACTER_AVATAR_HEIGHT: 70,

    VERSUS_KICKING_POINTS: 5,
    VERSUS_BOXING_POINTS: 3
};
