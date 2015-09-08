import AbstractState from './AbstractState';

class TrainingState extends AbstractState {
    preload() {
        super.preload();

        this.load.image('bg-training', './assets/graphics/backgrounds/bg-training.jpg');
    }

    create() {
        this.add.image(0, 0, 'bg-training');

        this.displayCentralMessage({ text: 'Start your training!' });

        this.loadSoundPreferences();
    }

    update() {

    }

    render() {

    }
}

export default TrainingState;
