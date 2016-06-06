import Character from './character';

class Goku extends Character {
    constructor(settings = {}) {
        settings.id = 'goku';
        settings.name = 'Son Gokū';
        super(settings);
    }
}

export default Goku;
