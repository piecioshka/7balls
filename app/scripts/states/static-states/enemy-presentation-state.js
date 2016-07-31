import AbstractState from '../abstract-state';
import Utilities from '../../common/utilities';

import { shout } from '../../helpers/meesage';
import { loadSoundPreferences } from '../../helpers/audio';

export default class EnemyPresentationState extends AbstractState {
    cb = null;
    lifetime = null;

    init({ cb, lifetime }) {
        this.cb = cb;
        this.lifetime = lifetime;
    }

    preload() {
        super.preload();

        this.load.image('bg-enemy', './assets/graphics/backgrounds/bg-enemy.png');

        this.load.image('freeza', './assets/graphics/characters/freeza/poster/freeza.png');
        this.load.image('cell', './assets/graphics/characters/cell/poster/cell.png');
        this.load.image('bubu', './assets/graphics/characters/bubu/poster/bubu.png');
    }

    create() {
        this.add.image(0, 0, 'bg-enemy');

        this._setupEnemy();
        this._displayEnemy();

        shout(this.game, { text: `${this.game.locale.ENEMY_PRESENTATION_STATE_WELCOME}!` });

        Utilities.timeout(this, this.lifetime, this.cb);

        loadSoundPreferences(this.game);
    }

    _setupEnemy() {
        // Add player object as common in all states.
        this.game.enemy = new this.game.enemies[0]();
    }

    _displayEnemy() {
        this.add.image(this._getCenterPixel('width'), this._getCenterPixel('height'), this.game.enemy.id);
    }

    _getCenterPixel(dimension) {
        return (this.game[dimension] / 2) - (this.cache.getImage(this.game.enemy.id)[dimension] / 2);
    }
}
