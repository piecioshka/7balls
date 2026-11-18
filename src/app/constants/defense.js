'use strict';

module.exports = {
    // How many Cell Jr. attack in total.
    MINIONS: 16,
    // Milliseconds between them.
    MINION_INTERVAL: 950,
    MINION_MIN_SPEED: 150,
    MINION_MAX_SPEED: 250,
    // Part of Cell Jr. who come right after the previous one.
    PAIRS: 0.3,
    PAIR_GAP: 300,
    // Health of a Cell Jr. and his power: blows take health like in a fight,
    // so a kick of Son Goku needs three, and one in a strong form is enough.
    MINION_HP: 12,
    CELL_JR_POWER: 4000000,

    // A blow pushes a Cell Jr. back only a little (pixels per second).
    KNOCK_BACK: 160,

    // Part of Cell Jr. who jump over the player, from how far, and how.
    LEAPERS: 0.35,
    LEAP_DISTANCE: 150,
    LEAP_SPEED: 520,
    LEAP_GRAVITY: 22,

    FRIEND_HP: 100,
    // HP taken from the friend by every Cell Jr. who gets to him.
    MINION_DAMAGE: 25,
    // HP taken from the player by a Cell Jr. who runs into him.
    CONTACT_DAMAGE: 6,
    // Where the lying friend ends; Cell Jr. who gets here hurts him.
    FRIEND_EDGE: 190,
    // The energy wave reaches only this far (pixels).
    WAVE_RANGE: 260
};
