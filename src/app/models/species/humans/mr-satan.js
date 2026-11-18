import SpeciesModel from '../../species-model';

export default class MrSatan extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Mr. Satan';
        settings.power = 100;
        super(settings);
    }
}
