import Player from '../player';

export default class Piccolo extends Player {
    constructor(settings = {}) {
        settings.id = 'piccolo';
        settings.name = 'Piccolo';
        super(settings);
    }
}
