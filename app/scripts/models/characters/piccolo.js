import Character from './character';

class Piccolo extends Character {
    constructor(settings = {}) {
        settings.id = 'piccolo';
        settings.name = 'Piccolo';
        super(settings);
    }
}

export default Piccolo;
