import SpeciesModel from '../../species-model';

export default class Cell extends SpeciesModel {

    constructor(settings = {}) {
        settings.title = 'Cell';
        super(settings);
    }
}
