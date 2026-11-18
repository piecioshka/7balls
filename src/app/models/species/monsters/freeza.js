import SpeciesModel from '../../species-model';

export default class Freeza extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Freeza';
        settings.power = 120000000;
        settings.background = 'bg-namek';
        settings.wave = 0xff5a8a;
        super(settings);
    }
}
