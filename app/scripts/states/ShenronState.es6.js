class ShenronState {
    preload() {
        this.load.image('bg-shenron', './assets/graphics/backgrounds/bg-shenron.jpg');
    }

    create() {
        this.add.image(0, 0, 'bg-shenron');

        this.time.events.add(Phaser.Timer.SECOND * 2, () => this.state.start('Fight'), this);
    }

    update() {

    }

    render() {

    }
}

export default ShenronState;
