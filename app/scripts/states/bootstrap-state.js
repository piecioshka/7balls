import runtime from '../runtime';

let debug = {
    log: require('debug')('7balls:bootstrap-state:log')
};

export default class BootstrapState extends Phaser.State {

    preload() {
        this.load.image('pixel-loading', './assets/pixelart/loading.png');
    }

    create() {
        this.stage.backgroundColor = '#000';
        runtime.emit('game:bootstrap');
    }
};
