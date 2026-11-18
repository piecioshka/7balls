import SpeciesModel from '../../species-model';

export default class Beerus extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Beerus';
        settings.power = 20000000000;
        settings.background = 'bg-beerus';
        settings.wave = 0xb070ff;
        super(settings);
    }
}
