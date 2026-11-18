let { addLabel } = require('../../helpers/message');

// TODO(piecioshka): refactoring, trzeba złączyć 2 pliki mixin.

module.exports = {
    _setupEnemyOptions() {
        let enemy = this.game.enemy;

        addLabel(this.game, 751, 27, 'HP');
        addLabel(this.game, 751, 57, 'EXP');
        this.options.enemy.avatar = this._addAvatar(724, 85, `${enemy.id}-avatar`);

        this.options.enemy.power = addLabel(this.game, 716, 85, '', [1, 0]);
        this._updatePower('enemy');

        this.options.enemy.hp = this._addBar(746, 25, 'bar-hp-invert', [1, 0]);
        this._updateEnemyOptionsHP();

        this.options.enemy.exp = this._addBar(746, 55, 'bar-exp-invert', [1, 0]);
        this._updateEnemyOptionsEXP();
    },

    _updateEnemyOptionsHP() {
        let hp = this.game.enemy.hp;
        let imageWidth = this.cache.getImage('bar-hp-invert').width;
        let width = hp * imageWidth / 100;

        this.options.enemy.hp.color.crop(new Phaser.Rectangle(imageWidth - width, 0, width, 16));
    },

    _updateEnemyOptionsEXP() {
        // The bar shows the way to the next 100 points of experience.
        let exp = this.game.enemy.exp % 100;
        let imageWidth = this.cache.getImage('bar-exp').width;
        let width = exp * imageWidth / 100;

        this.options.enemy.exp.color.crop(new Phaser.Rectangle(imageWidth - width, 0, width, 16));
    },

    _removeEnemyHP(value) {
        let enemy = this.game.enemy;
        let $enemy = enemy.getSprite();

        enemy.hp -= value;

        if (enemy.hp <= 0) {
            enemy.hp = 0;
            $enemy.events.onDied.dispatch();
        }

        this._updateEnemyOptionsHP();
        this._updatePower('enemy');
    },

    _addEnemyEXP(value) {
        let enemy = this.game.enemy;

        enemy.exp += value;


        this._updateEnemyOptionsEXP();
        this._updatePower('enemy');
    }
};
