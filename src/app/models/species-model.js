export default class SpeciesModel {
    constructor({ title, power = 1, wave = 0xffffff, background = null }) {
        this.title = title;

        // Base power level, as in the story.
        this.power = power;

        // Tint of the energy wave (white keeps it blue).
        this.wave = wave;

        // Key of the landscape where the character is fought (rivals only).
        this.background = background;
    }
}
