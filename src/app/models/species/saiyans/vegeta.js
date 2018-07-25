import SpeciesModel from '../../species-model';

export default class Vegeta extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Vegeta';
        super(settings);
    }
}
