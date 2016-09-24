import runtime from '../runtime';

let debug = {
    log: require('debug')('7balls:loading-state:log')
};

let utils = require('../common/utils');
let { addSaiyanLabel } = require('../helpers/message');

// Czas opóźnienia do schowania paska postępu.
const DISPLAY_LOADING_DELAY = 500;

/**
 * @extends Phaser.State
 */
export default class LoadingState extends Phaser.State {

    preload() {
        let title = addSaiyanLabel(this.game, this.world.centerX, 150, 'Loading...', [0.5, 0.5]);
        title.fontSize = 130;

        var pixelLoadingWidth = this.cache.getImage('pixel-loading').width;
        var progressBar = this.add.sprite(this.world.centerX - (pixelLoadingWidth / 2), 230, 'pixel-loading');
        this.load.setPreloadSprite(progressBar);

        debug.log('assets loading...');

        // graphics/backgrounds
        this.load.path = './assets/graphics/backgrounds/';

        this.load.image('bg-training-capsule', 'fight/training/bg-training-capsule.png');
        this.load.image('bg-versus-hell', 'fight/versus/bg-versus-hell.png');
        this.load.image('bg-versus-heaven', 'fight/versus/bg-versus-heaven.png');

        this.load.image('bg-select-language', 'select/select-language/bg-select-language.png');
        this.load.image('bg-select-player', 'select/select-player/bg-select-player.png');

        this.load.image('bg-enemy-presentation', 'static/enemy-presentation/bg-enemy-presentation.png');
        this.load.image('bg-player-presentation', 'static/player-presentation/bg-player-presentation.png');
        this.load.image('bg-game-over', 'static/game-over/bg-game-over.png');
        this.load.image('bg-message', 'static/message/bg-message.png');
        this.load.image('bg-winner', 'static/winner/bg-winner.png');
        this.load.image('bg-meal-house', 'static/meal/bg-meal-house.png');
        this.load.image('bg-shenron', 'static/shenron/bg-shenron.png');
        this.load.image('bg-shenron-growing', 'static/shenron/bg-shenron-growing.png');

        // graphics/bars
        this.load.path = './assets/graphics/bars/';

        this.load.image('bar-blank', 'blank.png');
        this.load.image('bar-exp', 'exp.png');
        this.load.image('bar-exp-invert', 'exp-invert.png');
        this.load.image('bar-hp', 'hp.png');
        this.load.image('bar-hp-invert', 'hp-invert.png');

        // graphics/buttons
        this.load.path = './assets/graphics/buttons/';

        this.load.image('btn-pl', 'pl-flag.png');
        this.load.image('btn-try-again', 'try-again.png');
        this.load.image('btn-try-again', 'try-again.png');
        this.load.image('btn-en', 'usa-flag.png');

        // graphics/characters
        this.load.path = './assets/graphics/characters/';

        this.load.image('bubu', 'bubu/poster/bubu.png');
        this.load.image('bubu-card', 'bubu/bubu-card.png');
        this.load.spritesheet('bubu-spritesheet', 'bubu/bubu-fight.png', 150, 200);

        this.load.image('cell-card', 'cell/cell-card.png');
        this.load.image('cell', 'cell/poster/cell.png');
        this.load.spritesheet('cell-spritesheet', 'cell/cell-fight.png', 150, 200);

        this.load.image('freeza-card', 'freeza/freeza-card.png');
        this.load.image('freeza', 'freeza/poster/freeza.png');
        this.load.spritesheet('freeza-spritesheet', 'freeza/freeza-fight.png', 150, 200);

        this.load.image('son-goku-collecting', 'son-goku/son-goku-collecting.png');
        this.load.image('son-goku-card', 'son-goku/son-goku-card.png');
        this.load.image('son-goku', 'son-goku/poster/son-goku.png');
        this.load.image('son-goku-halo', 'son-goku/poster/son-goku-halo.png');
        this.load.spritesheet('son-goku-spritesheet', 'son-goku/son-goku-fight.png', 150, 200);

        this.load.image('piccolo-collecting', 'piccolo/piccolo-collecting.png');
        this.load.image('piccolo-card', 'piccolo/piccolo-card.png');
        this.load.image('piccolo', 'piccolo/poster/piccolo.png');
        this.load.image('piccolo-halo', 'piccolo/poster/piccolo-halo.png');
        this.load.spritesheet('piccolo-spritesheet', 'piccolo/piccolo-fight.png', 150, 200);

        this.load.image('vegeta-collecting', 'vegeta/vegeta-collecting.png');
        this.load.image('vegeta-card', 'vegeta/vegeta-card.png');
        this.load.image('vegeta', 'vegeta/poster/vegeta.png');
        this.load.image('vegeta-halo', 'vegeta/poster/vegeta-halo.png');
        this.load.spritesheet('vegeta-spritesheet', 'vegeta/vegeta-fight.png', 150, 200);

        this.load.path = '';

        // graphics/icons

        this.load.image('mute', './assets/graphics/icons/mute.png');
        this.load.image('unmute', './assets/graphics/icons/unmute.png');

        // graphics/logo

        this.load.image('logo-minimal', './assets/graphics/logo/logo-minimal.png');

        debug.log('images files loaded');

        this.load.audio('sound-jump', './assets/sound/dbz/jump.ogg');

        this.load.audio('sound-weakkick', './assets/sound/dbz/weakkick.ogg');
        this.load.audio('sound-weakpunch', './assets/sound/dbz/weakpunch.ogg');

        this.load.audio('sound-mediumkick', './assets/sound/dbz/mediumkick.ogg');
        this.load.audio('sound-mediumpunch', './assets/sound/dbz/mediumpunch.ogg');

        this.load.audio('sound-strongkick', './assets/sound/dbz/strongkick.ogg');
        this.load.audio('sound-strongpunch', './assets/sound/dbz/strongpunch.ogg');

        this.load.audio('sound-ambience-thunder', './assets/sound/dbk/ambience_thunder.ogg');
        this.load.audio('sound-dramatic', './assets/sound/dbk/dramatic_reveal_01.ogg');
        this.load.audio('sound-thing1', './assets/sound/dbk/thing1.ogg');
        this.load.audio('scouter', './assets/sound/dbz/scouter.ogg');

        this.load.audio('scouter', './assets/sound/dbz/scouter.ogg');

        this.load.audio('sound-candypop', './assets/sound/dbz/candypop.ogg');
        this.load.audio('sound-radar', './assets/sound/dbk/devices_02.ogg');

        debug.log('audio files loaded');

        this.load.tilemap('collecting-1', './data/maps/collecting-1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('collecting-2', './data/maps/collecting-2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('collecting-3', './data/maps/collecting-3.json', null, Phaser.Tilemap.TILED_JSON);

        debug.log('tilemap files loaded');

        this.load.spritesheet('spr-collecting', './assets/graphics/spritesheet/spr-collecting.png', 40, 40);

        debug.log('spritesheet files loaded');

        this.load.json('positions-1', './data/balls-positions/positions-1.json');
        this.load.json('positions-2', './data/balls-positions/positions-2.json');
        this.load.json('positions-3', './data/balls-positions/positions-3.json');

        this.load.json('locale-en', './locale/en_EN.json');
        this.load.json('locale-pl', './locale/pl_PL.json');

        debug.log('json files loaded');

        this.load.text('font-saiyan-sans', './assets/fonts/Saiyan-Sans.ttf');

        debug.log('fonts files loaded');
    }

    create() {
        // Opóźnienie, aby wyświetlić przez chwilkę cały progressBar.
        utils.timeout(this, DISPLAY_LOADING_DELAY, () => {
            runtime.emit('game:loaded')
        });
    }
};
