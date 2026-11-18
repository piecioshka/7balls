import SpeciesModel from '../../species-model';

export default class Vegeta extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Vegeta';
        settings.power = 2500000;
        settings.wave = 0xd070ff;
        super(settings);
    }
}
