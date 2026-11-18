import SpeciesModel from '../../species-model';

export default class Bubu extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Bubu';
        settings.power = 2500000000;
        settings.background = 'bg-city';
        settings.wave = 0xff8fd0;
        super(settings);
    }
}
