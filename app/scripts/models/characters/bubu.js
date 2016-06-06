import Character from './character';

class Bubu extends Character {
    constructor(settings = {}) {
        settings.id = 'bubu';
        settings.name = 'Bubu';
        super(settings);
    }
}

export default Bubu;
