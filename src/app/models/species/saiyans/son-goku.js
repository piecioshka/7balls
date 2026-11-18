import SpeciesModel from '../../species-model';

export default class SonGoku extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Son Gokū';
        settings.power = 3000000;
        super(settings);
    }
}
