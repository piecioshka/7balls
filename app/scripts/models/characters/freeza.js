import Character from './character';

export default class Freeza extends Character {
    constructor(settings = {}) {
        settings.id = 'freeza';
        settings.name = 'Freeza';
        super(settings);
    }
}
