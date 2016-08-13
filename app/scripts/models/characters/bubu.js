import Player from '../player';

export default class Bubu extends Player {
    constructor(settings = {}) {
        settings.id = 'bubu';
        settings.name = 'Bubu';
        super(settings);
    }
}
