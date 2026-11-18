import SpeciesModel from '../../species-model';

export default class Krillin extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Krillin';
        settings.power = 75000;
        settings.wave = 0xffe066;
        super(settings);
    }
}
