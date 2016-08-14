let { displayCentralMessage } = require('../../helpers/message');
let { loadSoundPreferences } = require('../../helpers/audio');

/**
 * @extends Phaser.State
 */
export default class MessageState extends Phaser.State {
    text = null;
    cb = null;
    lifespan = null;

    init({ content, cb, lifespan }) {
        this.text = content;
        this.cb = cb;
        this.lifespan = lifespan;
    }

    create() {
        this.add.image(0, 0, 'bg-message');

        displayCentralMessage(this.game, { text: this.text, lifespan: this.lifespan, cb: this.cb });

        loadSoundPreferences(this.game);
    }
}
