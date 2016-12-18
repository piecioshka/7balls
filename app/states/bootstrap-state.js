export default class BootstrapState extends Phaser.State {
    preload() {
        this.load.image('pixel-loading', './assets/pixelart/loading.png');
    }

    create() {
        this.game.renderer.renderSession.roundPixels = true;
        this.stage.backgroundColor = '#000';
        this.game.emit('game:bootstrap');
    }
};
