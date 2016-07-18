import Character from './character';

class Freeza extends Character {
    constructor(settings = {}) {
        settings.id = 'freeza';
        settings.name = 'Freeza';
        super(settings);
    }
}

export default Freeza;
