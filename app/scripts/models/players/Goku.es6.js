import Player from './Player'

class Goku extends Player {
    constructor(...args) {
        super.apply(this, args);
    }
}

export default Goku;
