
import Utilities from '../../common/utils';

import { loadSoundPreferences } from '../../helpers/audio';

export default class PlayerPresentationState extends Phaser.State {
    name = null;
    cb = null;
    lifetime = null;

    init({ name, cb, lifetime }) {
        this.name = name;
        this.cb = cb;
        this.lifetime = lifetime;
    }

    create() {
        this.add.image(0, 0, 'bg-player');

        let getCenterPixel = (dimension) => {
            return (this.game[dimension] / 2) - (this.cache.getImage(this.name)[dimension] / 2);
        };

        this.add.image(getCenterPixel('width'), getCenterPixel('height'), this.name);

        Utilities.timeout(this, this.lifetime, this.cb);

        loadSoundPreferences(this.game);
    }
}
