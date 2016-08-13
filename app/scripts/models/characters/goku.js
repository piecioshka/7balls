import Player from '../player';

export default class Goku extends Player {
    constructor(settings = {}) {
        settings.id = 'goku';
        settings.name = 'Son Gokū';
        super(settings);
    }
}
