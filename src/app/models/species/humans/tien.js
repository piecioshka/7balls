import SpeciesModel from '../../species-model';

export default class Tien extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Tien';
        settings.power = 90000;
        settings.wave = 0xfff06a;
        super(settings);
    }
}
