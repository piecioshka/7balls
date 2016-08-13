let debug = {
    log: require('debug')('7balls:bootstrap-state:log')
};

/**
 * @extends Phaser.State
 */
export default class BootstrapState extends Phaser.State {
    preload() {
        this.load.image('pixel-loading', './assets/pixelart/loading.png');
    }

    create() {
        this.stage.backgroundColor = '#000';
        this.state.start('Loading');
    }
};
