import AbstractState from './AbstractState';

class MealState extends AbstractState {
    preload() {
        super.preload();

        this.load.image('bg-meal-house', './assets/graphics/backgrounds/meal/bg-meal-house.png');
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
