import SpeciesModel from '../../species-model';

export default class C16 extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'C-16';
        settings.power = 180000000;
        super(settings);
    }
}
