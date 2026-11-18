import SpeciesModel from '../../species-model';

export default class Trunks extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Trunks';
        settings.power = 1500000;
        settings.wave = 0xffe066;
        super(settings);
    }
}
