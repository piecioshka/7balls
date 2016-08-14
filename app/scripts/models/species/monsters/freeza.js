import SpeciesModel from '../../species-model';

export default class Freeza extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Freeza';
        super(settings);
    }
}
