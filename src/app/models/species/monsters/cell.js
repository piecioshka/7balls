import SpeciesModel from '../../species-model';

export default class Cell extends SpeciesModel {
    constructor(settings = {}) {
        settings.title = 'Cell';
        settings.power = 900000000;
        settings.background = 'bg-wasteland';
        settings.wave = 0x8cff66;
        super(settings);
    }
}
