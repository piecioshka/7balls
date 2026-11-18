import SpeciesModel from '../../species-model';

export default class Whis extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Whis';
        settings.power = 100000000000;
        settings.background = 'bg-beerus';
        super(settings);
    }
}
