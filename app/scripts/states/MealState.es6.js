import AbstractState from './AbstractState';

class MealState extends AbstractState {
    preload() {
        super.preload();

        this.load.image('bg-meal-house', './assets/graphics/backgrounds/bg-meal-house.jpg');
    }

    create() {
        this.add.image(0, 0, 'bg-meal-house');

        this.loadSoundPreferences();
    }

    update() {

    }

    render() {

    }
}

export default MealState;
