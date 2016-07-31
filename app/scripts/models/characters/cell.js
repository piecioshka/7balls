import Character from './character';

export default class Cell extends Character {
    constructor(settings = {}) {
        settings.id = 'cell';
        settings.name = 'Cell';
        super(settings);
    }
}
