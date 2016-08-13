import Character from '../character';

export default class Bubu extends Character {
    constructor(settings = {}) {
        settings.id = 'bubu';
        settings.name = 'Bubu';
        super(settings);
    }
}
