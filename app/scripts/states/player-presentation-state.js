import AbstractState from './abstract-state';
import Utilities from '../common/utilities';

class PlayerPresentationState extends AbstractState {
    name = null;
    cb = null;
    lifetime = null;

    init({ name, cb, lifetime }) {
        this.name = name;
        this.cb = cb;
        this.lifetime = lifetime;
    }

    preload() {
        super.preload();

        this.load.image('bg-player', './assets/graphics/backgrounds/bg-player.png');

        this.load.image('goku', './assets/graphics/characters/goku/poster/goku.png');
        this.load.image('goku-halo', './assets/graphics/characters/goku/poster/goku-halo.png');

        this.load.image('vegeta', './assets/graphics/characters/vegeta/poster/vegeta.png');
        this.load.image('vegeta-halo', './assets/graphics/characters/vegeta/poster/vegeta-halo.png');

        this.load.image('piccolo', './assets/graphics/characters/piccolo/poster/piccolo.png');
        this.load.image('piccolo-halo', './assets/graphics/characters/piccolo/poster/piccolo-halo.png');
    }

    create() {
        this.add.image(0, 0, 'bg-player');

        let getCenterPixel = (dimension) => {
            return (this.game[dimension] / 2) - (this.cache.getImage(this.name)[dimension] / 2);
        };

        this.add.image(getCenterPixel('width'), getCenterPixel('height'), this.name);

        Utilities.timeout(this, this.lifetime, this.cb);

        this.loadSoundPreferences();
    }
}

export default PlayerPresentationState;
