import SpeciesModel from '../../species-model';

export default class SonGoku extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Son Gokū';
        super(settings);
    }
}
