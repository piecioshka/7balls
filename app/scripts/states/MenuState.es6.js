class MenuState extends Phaser.State {
    preload() {
        console.log('MenuState#preload');
        this.load.image('bg-menu', './assets/graphics/backgrounds/bg-menu.jpg');
    }

    create() {
        console.log('MenuState#create');
        this.add.image(0, 0, 'bg-menu');
    }

    update() {
        // console.log('MenuState#update');
    }

    render() {
        // console.log('MenuState#render');
    }
}

export default MenuState;
