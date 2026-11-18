'use strict';

module.exports = {
    BOTTOM_MARGIN: 40,
    HORIZONTAL_SPEED: 300,
    JUMP: 500,
    FALL_SPEED: 12,
    // Falling is this many times faster than rising.
    FALL_FACTOR: 2.2,

    KICKING_POINTS: 5,
    BOXING_POINTS: 3,

    // Part of the strength added to blows by every level above the first one.
    LEVEL_BONUS: 0.2,

    // Blows of a Super Saiyan are this many times stronger.
    SUPER_SAIYAN_BONUS: 1.5,

    // Milliseconds the rival stays in a dodge.
    DODGE_TIME: 500,

    // The energy wave: its strength, how long it is visible and how often
    // it can be fired (milliseconds).
    WAVE_POINTS: 25,
    WAVE_TIME: 350,
    WAVE_COOLDOWN: 5000,

    // How far a blow reaches in front of the attacker, and how big a height
    // difference it still hits across (pixels).
    BLOW_REACH: 125,
    BLOW_HEIGHT: 110,

    // Health of every rival in the tournament.
    TOURNAMENT_HP: 60
};
