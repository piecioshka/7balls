import Configuration from '../../configuration';
import FightState from './FightState';
import Computer from '../../models/Computer';
import Freeza from '../../models/characters/Freeza';
import Cell from '../../models/characters/Cell';
import Bubu from '../../models/characters/Bubu';

class VersusState extends FightState {
    enemies = [Freeza, Cell, Bubu];
    keyboard = {
        x: null,
        c: null,
        up: null,
        space: null
    };
    sound = {
        jump: null,

        weakkick: null,
        weakpunch: null,

        mediumkick: null,
        mediumpunch: null,

        strongkick: null,
        strongpunch: null
    };
    options = {
        player: {
            hp: null,
            exp: null,
            lvl: null
        },
        enemy: {
            hp: null,
            exp: null,
            lvl: null
        }
    };

    preload() {
        super.preload();

        this.load.image('freeza-card', './assets/graphics/characters/freeza/freeza-card.jpg');
        this.load.image('cell-card', './assets/graphics/characters/cell/cell-card.jpg');
        this.load.image('bubu-card', './assets/graphics/characters/bubu/bubu-card.jpg');

        this.load.image('bar-hp-invert', './assets/graphics/bars/hp-invert.png');
        this.load.image('bar-exp-invert', './assets/graphics/bars/exp-invert.png');
    }

    create() {
        this.add.image(0, 0, 'bg-versus-sky');

        this._setupWorld();
        this._setupKeyboard();
        this._setupSound();

        this._createEnemy();

        this._setupSprite(150, 360, this.game.player);
        this._setupSprite(650, 360, this.game.enemy, [1, 1]);
        this._setupPlayerOptions();
        this._setupEnemyOptions();

        this._setupFight();

        this.displayLogo();
        this.displayCentralMessage({ text: 'Fight!', fontSize: 100 });

        this.loadSoundPreferences();
    }

    _setupFight() {
        let player = this.game.player;
        let enemy = this.game.enemy;

        let isCollision = () => this.physics.arcade.overlap(enemy.phaser, player.phaser);

        let handlePlayerBlow = (label, points) => {
            if (isCollision()) {
                this._addPlayerEXP(points);
                this._removeEnemyHP(points);
            }
        };

        player.phaser.events.onKicking.add(() => {
            handlePlayerBlow('kicking', Configuration.VERSUS_KICKING_POINTS)
        });
        player.phaser.events.onBoxing.add(() => {
            handlePlayerBlow('boxing', Configuration.VERSUS_BOXING_POINTS)
        });
        player.phaser.events.onDied.add(() => {
            this._finishFight('died', 'win');
        });

        let handleEnemyBlow = (label, points) => {
            if (isCollision()) {
                this._addEnemyEXP(points);
                this._removePlayerHP(points);
            }
        };

        enemy.phaser.events.onKicking.add(() => handleEnemyBlow('kicking', Configuration.VERSUS_KICKING_POINTS));
        enemy.phaser.events.onBoxing.add(() => handleEnemyBlow('boxing', Configuration.VERSUS_BOXING_POINTS));
        enemy.phaser.events.onDied.add(() => {
            this._finishFight('win', 'died');
        });

        Computer.applyArtificialIntelligence(this, enemy);
    }

    _finishFight(playerSate, enemyState) {
        let player = this.game.player;
        let enemy = this.game.enemy;

        this.input.keyboard.enabled = false;

        this.displayCentralMessage({ text: `Player ${playerSate.toUpperCase()}!`, fontSize: 100 });

        player.phaser.play(playerSate);
        console.log('Character "%s" is ', player.name, playerSate.toUpperCase());

        enemy.phaser.play(enemyState);
        console.log('Character "%s" is ', enemy.name, enemyState.toUpperCase());

        this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
            this.input.keyboard.enabled = true;
            this.state.start('GameOver');
        });
    }

    _randomEnemy() {
        return this.enemies[parseInt(Math.random() * this.enemies.length)];
    }

    _createEnemy() {
        // Random enemy from predefined list.
        let Character = this._randomEnemy();

        // Add player object as common in all states.
        this.game.enemy = new Character();

        console.log('Random character: ', this.game.enemy.name);
    }

    _setupEnemyOptions() {
        let enemy = this.game.enemy;

        this.addSaiyanLabel(755, 18, 'HP');
        this.addSaiyanLabel(755, 48, 'EXP');
        this._addAvatar(745, 85, `${enemy.id}-card`);

        this.options.enemy.lvl = this.addSaiyanLabel(733, 81, `${enemy.lvl} lvl`, [1, 0]);

        this.options.enemy.hp = this._addBar(746, 25, 'bar-hp-invert', [1, 0]);
        this._updateEnemyOptionsHP();

        this.options.enemy.exp = this._addBar(746, 55, 'bar-exp-invert', [1, 0]);
        this._updateEnemyOptionsEXP();
    }

    _updateEnemyOptionsHP() {
        let hp = this.game.enemy.hp;
        let imageWidth = this.cache.getImage('bar-hp-invert').width;
        let width = hp * imageWidth / 100;
        this.options.enemy.hp.color.crop(new Phaser.Rectangle(imageWidth - width, 0, width, 16));
    }

    _updateEnemyOptionsEXP() {
        let exp = this.game.enemy.exp;
        let imageWidth = this.cache.getImage('bar-exp').width;
        let width = exp * imageWidth / 100;
        this.options.enemy.exp.color.crop(new Phaser.Rectangle(imageWidth - width, 0, width, 16));
    }

    _removeEnemyHP(value) {
        let enemy = this.game.enemy;
        enemy.hp -= value;

        if (enemy.hp <= 0) {
            enemy.hp = 0;
            enemy.phaser.events.onDied.dispatch();
        }

        this._updateEnemyOptionsHP();
        this._updateOptionsLvL('enemy');
    }

    _addEnemyEXP(value) {
        let enemy = this.game.enemy;
        enemy.exp += value;

        if (enemy.exp >= Configuration.PLAYER_MAXIMUM_EXPERIENCE) {
            enemy.exp = 0;

            if (enemy.lvl < Configuration.PLAYER_MAXIMUM_LEVEL) {
                enemy.lvl++;
            }
        }

        this._updateEnemyOptionsEXP();
        this._updateOptionsLvL('enemy');
    }

    update() {
        super.update();
        FightState._handleCharacterVelocity(this.game.enemy);
    }

    render() {
        let player = this.game.player;
        // this.game.debug.bodyInfo(player.phaser, 25, 25);
        this.game.debug.body(player.phaser);

        let enemy = this.game.enemy;
        // this.game.debug.bodyInfo(enemy.phaser, 25, 225);
        this.game.debug.body(enemy.phaser);
    }
}

export default VersusState;
