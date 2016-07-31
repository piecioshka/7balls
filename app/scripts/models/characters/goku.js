import Character from './character';

export default class Goku extends Character {
    constructor(settings = {}) {
        settings.id = 'goku';
        settings.name = 'Son Gokū';
        super(settings);
    }
}
