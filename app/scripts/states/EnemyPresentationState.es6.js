import AbstractState from './AbstractState';
import Utilities from '../common/Utilities';

class EnemyPresentationState extends AbstractState {
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

        this.add.image(this._getCenterPixel('width'), this._getCenterPixel('height'), this.game.enemy.id);

        Utilities.timeout(this, this.lifetime, this.cb);

        this.loadSoundPreferences();
    }

    _setupEnemy() {
        // Add player object as common in all states.
        this.game.enemy = new this.game.enemies[0]();
    }

    _getCenterPixel(dimension) {
        return (this.game[dimension] / 2) - (this.cache.getImage(this.game.enemy.id)[dimension] / 2);
    }
}

export default EnemyPresentationState;
