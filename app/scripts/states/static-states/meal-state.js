import AbstractState from '../abstract-state';
import Utilities from '../../common/utilities';
import Character from '../../models/characters/character';

import { shout } from '../../helpers/meesage';
import { loadSoundPreferences } from '../../helpers/audio';

export default class MealState extends AbstractState {
    lifetime = null;
    cb = null;

    init({ lifetime, cb }) {
        this.lifetime = lifetime;
        this.cb = cb;
    }

    preload() {
        super.preload();

        this.load.image('bg-meal-house', './assets/graphics/backgrounds/meal/bg-meal-house.png');
    }

    create() {
        this.add.image(0, 0, 'bg-meal-house');

        this.game.player.hp = Character.defaultNumbers.hp;

        shout(this.game, { text: `${this.game.locale.MEAL_STATE_WELCOME}` });

        Utilities.timeout(this, this.lifetime, this.cb);

        loadSoundPreferences(this.game);
    }
}
