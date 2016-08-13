import Player from '../player';

export default class Vegeta extends Player {
    constructor(settings = {}) {
        settings.id = 'vegeta';
        settings.name = 'Vegeta';
        super(settings);
    }
}
