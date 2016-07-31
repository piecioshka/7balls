import Character from './character';

export default class Vegeta extends Character {
    constructor(settings = {}) {
        settings.id = 'vegeta';
        settings.name = 'Vegeta';
        super(settings);
    }
}
