import SpeciesModel from '../../species-model';

export default class Goten extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Goten';
        settings.power = 800000;
        super(settings);
    }
}
