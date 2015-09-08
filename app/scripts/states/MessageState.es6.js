import AbstractState from './AbstractState';

class MessageState extends AbstractState {
    body = undefined;
    callback = undefined;
    lifetime = undefined;

    init({ body, callback, lifetime }) {
        this.body = body;
        this.callback = callback;
        this.lifetime = lifetime;
    }

    preload() {
        super.preload();

        this.load.image('bg-message', './assets/graphics/backgrounds/bg-message.png');
    }

    create() {
        this.loadSoundPreferences();

        this.add.image(0, 0, 'bg-message');

        this.displayCentralMessage({ text: this.body, time: this.lifetime, cb: this.callback });
    }

    update() {

    }

    render() {

    }
}

export default MessageState;
