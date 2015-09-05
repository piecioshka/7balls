import Character from './Character'

class Cell extends Character {
    constructor(settings = {}) {
        settings.id = 'cell';
        settings.name = 'Cell';
        super(settings);
    }
}

export default Cell;
