import SpeciesModel from '../../species-model';

export default class Bubu extends SpeciesModel {

    constructor(settings = {}) {
        settings.title = 'Bubu';
        super(settings);
    }
}
