// Frames of a fight spritesheet (see scripts/draw-characters.js).
// The first 15 frames look to the right, the next 15 are the same
// frames looking to the left.
const FRAMES = {
    STANDING: [0, 1, 2],
    PUNCH: [3, 4],
    JUMP: 5,
    KICK: [6, 7],
    DODGE: 8,
    FRONT: 9,
    WIN: [9, 10, 11],
    HURT: [12, 13, 14]
};
const LEFT_OFFSET = 15;

// The Saiyans can use Saiyan forms (see constants/power.js).
const SAIYANS = ['son-goku', 'vegeta', 'gohan', 'goten', 'trunks'];

/**
 * @param {number} index Frame looking to the right.
 * @param {string} facing "right" or "left".
 * @returns {number}
 */
function frameOf(index, facing) {
    return facing === 'left' ? index + LEFT_OFFSET : index;
}

/**
 * @param {Character} character
 * @returns {boolean}
 */
function isSaiyan(character) {
    return SAIYANS.includes(character.id);
}

/**
 * Key of the fight spritesheet of a character, in a Saiyan form included.
 *
 * @param {Phaser.Game} game
 * @param {Character} character
 * @returns {string}
 */
function fightSpriteOf(game, character) {
    let form = character.forms && character.forms.saiyan;

    return `${character.id}${form ? `-${form}` : ''}-fight`;
}

module.exports = {
    FRAMES,
    SAIYANS,
    frameOf,
    isSaiyan,
    fightSpriteOf
};
