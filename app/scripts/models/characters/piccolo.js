import Character from '../character';

export default class Piccolo extends Character {
    constructor(settings = {}) {
        settings.id = 'piccolo';
        settings.name = 'Piccolo';
        super(settings);
    }
}
