import SpeciesModel from '../../species-model';

export default class C17 extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'C-17';
        settings.power = 160000000;
        super(settings);
    }
}
