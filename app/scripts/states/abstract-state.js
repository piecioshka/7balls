export default class AbstractState extends Phaser.State {
    preload() {
        this.load.image('mute', './assets/graphics/icons/mute.png');
        this.load.image('unmute', './assets/graphics/icons/unmute.png');

        this.load.text('font-saiyan-sans', './assets/fonts/Saiyan-Sans.ttf');
    }
}
