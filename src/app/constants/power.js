'use strict';

module.exports = {
    // Every 100 points of experience add the base power once more.
    EXP_PER_BASE_POWER: 100,

    // Each time the attacker is 10 times stronger, a blow takes twice
    // as much health. The difference is limited, so a fight with a much
    // stronger rival is very hard, but not hopeless.
    DAMAGE_PER_TENFOLD: 2,
    MIN_DAMAGE_FACTOR: 1 / 3,
    MAX_DAMAGE_FACTOR: 3,

    // Forms of the Saiyans, from the weakest one; S switches to the next.
    // "multiplier": how many times the form multiplies the power,
    // "drain": health taken every second, "blow": blows are that much
    // stronger, "ids": who can use the form.
    SAIYAN_FORMS: [
        { name: 'ssj', multiplier: 20, drain: 4, blow: 1.6, ids: ['son-goku', 'vegeta', 'gohan', 'goten', 'trunks'] },
        { name: 'ssj2', multiplier: 40, drain: 6, blow: 1.8, ids: ['son-goku', 'vegeta', 'gohan', 'trunks'] },
        { name: 'ssj3', multiplier: 160, drain: 10, blow: 2.1, ids: ['son-goku'] },
        { name: 'god', multiplier: 400, drain: 5, blow: 2.3, ids: ['son-goku', 'vegeta'] },
        { name: 'blue', multiplier: 1000, drain: 7, blow: 2.6, ids: ['son-goku', 'vegeta'] }
    ],

    // Kaioken can be used by everybody, also together with a Saiyan form.
    KAIOKEN: { multiplier: 10, drain: 2, blow: 1.4 },

    // A form ends by itself when the health drops this low.
    MIN_FORM_HP: 10
};
