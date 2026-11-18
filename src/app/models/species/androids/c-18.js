import SpeciesModel from '../../species-model';

export default class C18 extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'C-18';
        settings.power = 150000000;
        super(settings);
    }
}
