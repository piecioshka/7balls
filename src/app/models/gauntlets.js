import Freeza from './species/monsters/freeza';
import Cell from './species/monsters/cell';
import Bubu from './species/monsters/bubu';
import Beerus from './species/monsters/beerus';
import C16 from './species/androids/c-16';
import C17 from './species/androids/c-17';
import C18 from './species/androids/c-18';

// Rivals of the duels, in the order of the rounds.
export const DUELS = [Freeza, Cell, Bubu, Beerus];

// Rounds with several rivals, who come one after another.
export const GAUNTLETS = {
    androids: [C17, C18, C16],
    // Everybody, in the order they were met.
    tournament: [Freeza, C17, C18, C16, Cell, Bubu, Beerus]
};
