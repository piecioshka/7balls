import SpeciesModel from '../../species-model';

export default class Yamcha extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Yamcha';
        settings.power = 50000;
        settings.wave = 0xffb347;
        super(settings);
    }
}
