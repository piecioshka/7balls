import AbstractState from './AbstractState';

class MealState extends AbstractState {
    preload() {
        super.preload();

        this.load.image('bg-meal-house', './assets/graphics/backgrounds/bg-meal-house.jpg');
    }

    create() {
        this.loadSoundPreferences();

        this.add.image(0, 0, 'bg-meal-house');
    }

    update() {

    }

    render() {

    }
}

export default MealState;
