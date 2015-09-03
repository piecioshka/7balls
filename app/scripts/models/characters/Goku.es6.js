import Character from './Character'

class Goku extends Character {
    constructor(settings = {}) {
        settings.id = 'goku';
        settings.name = 'Son Gokū';
        super(settings);
    }
}

export default Goku;
