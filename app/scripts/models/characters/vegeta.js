import Character from './character';

class Vegeta extends Character {
    constructor(settings = {}) {
        settings.id = 'vegeta';
        settings.name = 'Vegeta';
        super(settings);
    }
}

export default Vegeta;
