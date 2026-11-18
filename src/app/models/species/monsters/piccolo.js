import SpeciesModel from '../../species-model';

export default class Piccolo extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Piccolo';
        settings.power = 1000000;
        settings.wave = 0xffb347;
        super(settings);
    }
}
