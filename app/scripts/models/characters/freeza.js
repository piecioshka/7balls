import Player from '../player';

export default class Freeza extends Player {
    constructor(settings = {}) {
        settings.id = 'freeza';
        settings.name = 'Freeza';
        super(settings);
    }
}
