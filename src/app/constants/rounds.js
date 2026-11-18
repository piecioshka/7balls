'use strict';

// Rounds of the game, in the order they are played.
//  - state: the game state which runs the round,
//  - music: the track played during the round,
//  - hasRival: the introduction shows who the player will fight with,
//  - gauntlet: several rivals come one after another (see models/gauntlets.js),
//  - isTournament: the last round, on the ring of the Tournament of Power.
// Names, goals and controls of the rounds are in the locale files (ROUNDS),
// in the same order.
module.exports = [
    { state: 'CollectDragonBalls', music: 'collect' },
    { state: 'Fight', music: 'tyrant', hasRival: true },
    { state: 'AvoidMonsters', music: 'flight' },
    { state: 'Fight', music: 'androids', hasRival: true, gauntlet: 'androids' },
    { state: 'Fight', music: 'final', hasRival: true },
    { state: 'DefendFriend', music: 'defend' },
    { state: 'Fight', music: 'duel', hasRival: true },
    { state: 'WhisTraining', music: 'training' },
    { state: 'Fight', music: 'god', hasRival: true },
    { state: 'Fight', music: 'tournament', hasRival: true, gauntlet: 'tournament', isTournament: true }
];
