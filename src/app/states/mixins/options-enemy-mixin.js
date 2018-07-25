const PLAYER = require('../../constants/player');
let { addSaiyanLabel } = require('../../helpers/message');

// TODO(piecioshka): refactoring, trzeba złączyć 2 pliki mixin.

module.exports = {
    _setupEnemyOptions() {
        let enemy = this.game.enemy;

        addSaiyanLabel(this.game, 755, 18, 'HP');
        addSaiyanLabel(this.game, 755, 48, 'EXP');
        this._addAvatar(745, 85, `${enemy.id}-card`);

        this.options.enemy.lvl = addSaiyanLabel(this.game, 733, 81, `${enemy.lvl} ${this.game.locale.FIGHT_STATE_LEVEL_SHORT}`, [1, 0]);

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
        let exp = this.game.enemy.exp;
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
        this._updateOptionsLvL('enemy');
    },

    _addEnemyEXP(value) {
        let enemy = this.game.enemy;

        enemy.exp += value;

        if (enemy.exp >= PLAYER.MAXIMUM_EXPERIENCE) {
            enemy.exp = 0;

            if (enemy.lvl < PLAYER.MAXIMUM_LEVEL) {
                enemy.lvl++;
            }
        }

        this._updateEnemyOptionsEXP();
        this._updateOptionsLvL('enemy');
    }
};
