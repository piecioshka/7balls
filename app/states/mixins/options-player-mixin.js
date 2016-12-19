const PLAYER = require('../../constants/player');
let { addSaiyanLabel } = require('../../helpers/message');

// TODO(piecioshka): refactoring, trzeba złączyć 2 pliki mixin.

module.exports = {
    _setupPlayerOptions() {
        let player = this.game.player;

        addSaiyanLabel(this.game, 21, 18, 'HP');
        addSaiyanLabel(this.game, 8, 48, 'EXP');
        this._addAvatar(6, 85, `${player.id}-card`);

        this.options.player.lvl = addSaiyanLabel(this.game, 63, 81, `${player.lvl} ${this.game.locale.FIGHT_STATE_LEVEL_SHORT}`);

        this.options.player.hp = this._addBar(55, 25, 'bar-hp');
        this._updatePlayerOptionsHP();

        this.options.player.exp = this._addBar(55, 55, 'bar-exp');
        this._updatePlayerOptionsEXP();
    },

    _updatePlayerOptionsHP() {
        let hp = this.game.player.hp;
        let imageWidth = this.cache.getImage('bar-hp').width;
        let width = hp * imageWidth / 100;
        this.options.player.hp.color.crop(new Phaser.Rectangle(0, 0, width, 16));
    },

    _updatePlayerOptionsEXP() {
        let exp = this.game.player.exp;
        let imageWidth = this.cache.getImage('bar-exp').width;
        let width = exp * imageWidth / 100;
        this.options.player.exp.color.crop(new Phaser.Rectangle(0, 0, width, 16));
    },

    _removePlayerHP(value) {
        let player = this.game.player;
        let $playerSprite = player.getSprite();

        player.hp -= value;

        if (player.hp <= 0) {
            player.hp = 0;
            $playerSprite.events.onDied.dispatch();
        }

        this._updatePlayerOptionsHP();
        this._updateOptionsLvL('player');
    },

    _addPlayerEXP(value) {
        let player = this.game.player;

        player.exp += value;

        if (player.exp >= PLAYER.MAXIMUM_EXPERIENCE) {
            player.exp = 0;

            if (player.lvl < PLAYER.MAXIMUM_LEVEL) {
                player.lvl++;
            }
        }

        this._updatePlayerOptionsEXP();
        this._updateOptionsLvL('player');
    }
};
