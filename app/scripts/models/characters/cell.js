import Player from '../player';

export default class Cell extends Player {
    constructor(settings = {}) {
        settings.id = 'cell';
        settings.name = 'Cell';
        super(settings);
    }
}
