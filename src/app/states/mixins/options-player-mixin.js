let { addLabel } = require('../../helpers/message');

// TODO(piecioshka): refactoring, trzeba złączyć 2 pliki mixin.

module.exports = {
    _setupPlayerOptions() {
        let player = this.game.player;

        addLabel(this.game, 50, 27, 'HP', [1, 0]);
        addLabel(this.game, 50, 57, 'EXP', [1, 0]);
        this.options.player.avatar = this._addAvatar(6, 85, `${player.id}-avatar`);

        this.options.player.power = addLabel(this.game, 82, 85, '', [0, 0]);
        this._updatePower('player');

        this.options.player.hp = this._addBar(55, 25, 'bar-hp');
        this._updatePlayerOptionsHP();

        this.options.player.exp = this._addBar(55, 55, 'bar-exp');
        this._updatePlayerOptionsEXP();
    },

    _updatePlayerOptionsHP() {
        let hp = this.game.player.hp;
        let imageWidth = this.cache.getImage('bar-hp').width;
        let width = hp * imageWidth / 100;
        this.options.player.hp.color.crop(new Phaser.Rectangle(0, 0, width, 15));
    },

    _updatePlayerOptionsEXP() {
        // The bar shows the way to the next 100 points of experience.
        let exp = this.game.player.exp % 100;
        let imageWidth = this.cache.getImage('bar-exp').width;
        let width = exp * imageWidth / 100;
        this.options.player.exp.color.crop(new Phaser.Rectangle(0, 0, width, 15));
    },

    _removePlayerHP(value) {
        let player = this.game.player;
        let $player = player.getSprite();

        player.hp -= value;

        if (player.hp <= 0) {
            player.hp = 0;
            $player.events.onDied.dispatch();
        }

        this._updatePlayerOptionsHP();
        this._updatePower('player');
    },

    _addPlayerEXP(value) {
        let player = this.game.player;

        player.exp += value;


        this._updatePlayerOptionsEXP();
        this._updatePower('player');
    }
};
