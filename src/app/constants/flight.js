'use strict';

module.exports = {
    // Seconds to survive.
    TIME: 15,

    PLAYER_SPEED: 280,

    // Milliseconds between monsters.
    MONSTER_INTERVAL: 650,
    MONSTER_MIN_SPEED: 220,
    MONSTER_MAX_SPEED: 380,
    // HP taken by one hit.
    MONSTER_DAMAGE: 10,

    CLOUD_SPEED: 3,

    // The energy wave: how long it is visible, how often it can be fired
    // (milliseconds) and how far from its middle it reaches (pixels).
    WAVE_TIME: 350,
    WAVE_COOLDOWN: 1200,
    WAVE_REACH: 45
};
