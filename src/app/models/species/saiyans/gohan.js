import SpeciesModel from '../../species-model';

export default class Gohan extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Gohan';
        settings.power = 2000000;
        settings.wave = 0xfff06a;
        super(settings);
    }
}
