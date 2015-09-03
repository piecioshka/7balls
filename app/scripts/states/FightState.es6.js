class FightState extends Phaser.State {
    preload() {
        this.load.image('bg-fight', './assets/graphics/backgrounds/bg-fight.jpg');
    }

    create() {
        this.add.image(0, 0, 'bg-fight');
    }

    update() {

    }

    render() {

    }
}

export default FightState;
