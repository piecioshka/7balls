import Configuration from '../../configuration';
import FightState from './FightState';
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
        this.load.image('bar-exp-invert-disable', './assets/graphics/bars/exp-invert-disable.png');
    }

    create() {
        this.loadSoundPreferences();

        this.add.image(0, 0, 'bg-versus-sky');

        this._setupLogo();
        this._setupWorld();
        this._setupKeyboard();

        this._createEnemy();

        this._setupPlayerSprite();
        this._setupEnemySprite();
        this._setupPlayerOptions();
        this._setupEnemyOptions();

        this._setupFight();

        this.displayCentralMessage({ text: 'Fight!' });

        this._setupSound();
    }

    _setupFight() {
        let player = this.game.player;

        let isCharactersOverlap = () => {
            return this.physics.arcade.overlap(this.game.player.phaser, this.game.enemy.phaser);
        };

        player.phaser.events.onKicking.add(() => {
            if (isCharactersOverlap()) {
                this._addPlayerEXP(Configuration.VERSUS_KICKING_POINTS);
                this._removeEnemyHP(Configuration.VERSUS_KICKING_POINTS);
            }
        });

        player.phaser.events.onBoxing.add(() => {
            if (isCharactersOverlap()) {
                this._addPlayerEXP(Configuration.VERSUS_BOXING_POINTS);
                this._removeEnemyHP(Configuration.VERSUS_BOXING_POINTS);
            }
        });
    }

    _createEnemy() {
        // Random enemy from predefined list.
        let Character = this._randomEnemy();

        // Add player object as common in all states.
        this.game.enemy = new Character();

        console.log('Random character: ', this.game.enemy.name);
    }

    _removeEnemyHP(value) {
        let enemy = this.game.enemy;
        enemy.hp -= value;

        if (enemy.hp <= 0) {
            enemy.hp = 0;

            this.input.keyboard.enabled = false;
            this._finishFight('win', 'died');

            this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
                this.input.keyboard.enabled = true;
                this.state.start('GameOver');
            });
        }

        this._updateEnemyOptionsHP();
        this._updateEnemyOptionsLvL();
    }

    _finishFight(playerSate, enemyState) {
        let player = this.game.player;
        let enemy = this.game.enemy;

        this.displayCentralMessage({ text: `Player ${playerSate.toUpperCase()}!` });

        player.phaser.play(playerSate);
        console.log('Character "%s" is ', player.name, playerSate.toUpperCase());

        enemy.phaser.play(enemyState);
        console.log('Character "%s" is ', enemy.name, enemyState.toUpperCase());
    }

    _setupEnemySprite() {
        let enemy = this.game.enemy;

        enemy.phaser = this.add.sprite(650, 360, `${enemy.id}-spritesheet`);
        enemy.phaser.anchor.setTo(1, 1);

        this._defineDefaultProperties(enemy.phaser);
        FightState._defineAnimations(enemy.phaser, enemy.name);
    }

    _setupEnemyOptions() {
        let enemy = this.game.enemy;

        this.addSaiyanLabel(755, 18, 'HP');
        this.addSaiyanLabel(755, 48, 'EXP');
        this._addAvatar(745, 85, `${enemy.id}-card`);

        this.options.enemy.lvl = this.addSaiyanLabel(733, 81, `${enemy.lvl} lvl`, [1, 0]);

        this.options.enemy.hp = this._addBar(746, 25, 'bar-hp-invert', [1, 0]);
        this._updateEnemyOptionsHP();

        this.options.enemy.exp = this._addBar(746, 55, 'bar-exp-invert-disable', [1, 0]);
        FightState._disableBar(this.options.enemy.exp);
    }

    _updateEnemyOptionsHP() {
        let hp = this.game.enemy.hp;
        let imageWidth = this.cache.getImage('bar-hp-invert').width;
        let width = hp * imageWidth / 100;
        this.options.enemy.hp.color.crop(new Phaser.Rectangle(imageWidth - width, 0, width, 16));
    }

    _updateEnemyOptionsLvL() {
        this.options.enemy.lvl.setText(`${this.game.enemy.lvl} lvl`);
    }

    _randomEnemy() {
        let randomNumber = parseInt(Math.random() * 3);
        return this.enemies[randomNumber];
    }

    update() {
        super.update();
    }

    render() {
        // let player = this.game.player;
        // this.game.debug.bodyInfo(player.phaser, 25, 25);
        // this.game.debug.body(player.phaser);

        // let enemy = this.game.enemy;
        // this.game.debug.bodyInfo(enemy.phaser, 25, 225);
        // this.game.debug.body(enemy.phaser);
    }
}

export default VersusState;
