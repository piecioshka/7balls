import SpeciesModel from '../../species-model';

export default class Piccolo extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Piccolo';
        super(settings);
    }
}
