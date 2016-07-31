import AbstractState from './abstract-state';

import { displayCentralMessage } from '../helpers/meesage';
import { loadSoundPreferences } from '../helpers/audio';

export default class MessageState extends AbstractState {
    body = null;
    cb = null;
    lifetime = null;

    init({ body, cb, lifetime }) {
        this.body = body;
        this.cb = cb;
        this.lifetime = lifetime;
    }

    preload() {
        super.preload();

        this.load.image('bg-message', './assets/graphics/backgrounds/bg-message.png');
    }

    create() {
        this.add.image(0, 0, 'bg-message');

        displayCentralMessage(this.game, { text: this.body, lifetime: this.lifetime, cb: this.cb, fontSize: 50 });

        loadSoundPreferences(this.game);
    }
}
