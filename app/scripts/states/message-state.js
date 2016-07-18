import AbstractState from './abstract-state';

class MessageState extends AbstractState {
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

        this.displayCentralMessage({ text: this.body, lifetime: this.lifetime, cb: this.cb, fontSize: 50 });

        this.loadSoundPreferences();
    }
}

export default MessageState;
