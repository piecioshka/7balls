let debug = {
    log: require('debug')('7balls:loading-state:log')
};

// Czas opóźnienia do schowania paska postępu.
const DISPLAY_LOADING_DELAY = 500;

/**
 * @extends Phaser.State
 */
export default class LoadingState extends Phaser.State {
    preload() {
        var loadingLabel = this.add.text(this.world.centerX, 150, 'Loading...', { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);

        var pixelLoadingWidth = this.cache.getImage('pixel-loading').width;
        var progressBar = this.add.sprite(this.world.centerX - (pixelLoadingWidth / 2), 200, 'pixel-loading');
        this.load.setPreloadSprite(progressBar);

        debug.log('assets loading...');

        // graphics/backgrounds

        this.load.image('bg-enemy', './assets/graphics/backgrounds/bg-enemy.png');
        this.load.image('bg-game-over', './assets/graphics/backgrounds/bg-game-over.png');
        this.load.image('bg-language', './assets/graphics/backgrounds/bg-language.png');
        this.load.image('bg-menu', './assets/graphics/backgrounds/bg-menu.png');
        this.load.image('bg-message', './assets/graphics/backgrounds/bg-message.png');
        this.load.image('bg-player', './assets/graphics/backgrounds/bg-player.png');
        this.load.image('bg-winner', './assets/graphics/backgrounds/bg-winner.png');

        this.load.image('bg-meal-house', './assets/graphics/backgrounds/meal/bg-meal-house.png');
        this.load.image('bg-shenron-growing', './assets/graphics/backgrounds/shenron/bg-shenron-growing.png');
        this.load.image('bg-shenron', './assets/graphics/backgrounds/shenron/bg-shenron.png');
        this.load.image('bg-training-capsule', './assets/graphics/backgrounds/training/bg-training-capsule.png');
        this.load.image('bg-versus-hell', './assets/graphics/backgrounds/versus/bg-versus-hell.png');
        this.load.image('bg-versus-sky', './assets/graphics/backgrounds/versus/bg-versus-sky.png');

        // graphics/bars

        this.load.image('bar-blank', './assets/graphics/bars/blank.png');
        this.load.image('bar-exp', './assets/graphics/bars/exp.png');
        this.load.image('bar-exp-invert', './assets/graphics/bars/exp-invert.png');
        this.load.image('bar-hp', './assets/graphics/bars/hp.png');
        this.load.image('bar-hp-invert', './assets/graphics/bars/hp-invert.png');

        // graphics/buttons

        this.load.image('btn-pl', './assets/graphics/buttons/pl-flag.png');
        this.load.image('btn-try-again', './assets/graphics/buttons/try-again.png');
        this.load.image('btn-try-again', './assets/graphics/buttons/try-again.png');
        this.load.image('btn-en', './assets/graphics/buttons/usa-flag.png');

        // graphics/characters

        this.load.image('bubu', './assets/graphics/characters/bubu/poster/bubu.png');
        this.load.image('bubu-card', './assets/graphics/characters/bubu/bubu-card.png');
        this.load.spritesheet('bubu-spritesheet', './assets/graphics/characters/bubu/bubu-fight.png', 150, 200);

        this.load.image('cell-card', './assets/graphics/characters/cell/cell-card.png');
        this.load.image('cell', './assets/graphics/characters/cell/poster/cell.png');
        this.load.spritesheet('cell-spritesheet', './assets/graphics/characters/cell/cell-fight.png', 150, 200);

        this.load.image('freeza-card', './assets/graphics/characters/freeza/freeza-card.png');
        this.load.image('freeza', './assets/graphics/characters/freeza/poster/freeza.png');
        this.load.spritesheet('freeza-spritesheet', './assets/graphics/characters/freeza/freeza-fight.png', 150, 200);

        this.load.image('goku-collecting', './assets/graphics/characters/goku/goku-collecting.png');
        this.load.image('goku-card', './assets/graphics/characters/goku/goku-card.png');
        this.load.image('goku', './assets/graphics/characters/goku/poster/goku.png');
        this.load.image('goku-halo', './assets/graphics/characters/goku/poster/goku-halo.png');
        this.load.spritesheet('goku-spritesheet', './assets/graphics/characters/goku/goku-fight.png', 150, 200);

        this.load.image('piccolo-collecting', './assets/graphics/characters/piccolo/piccolo-collecting.png');
        this.load.image('piccolo-card', './assets/graphics/characters/piccolo/piccolo-card.png');
        this.load.image('piccolo', './assets/graphics/characters/piccolo/poster/piccolo.png');
        this.load.image('piccolo-halo', './assets/graphics/characters/piccolo/poster/piccolo-halo.png');
        this.load.spritesheet('piccolo-spritesheet', './assets/graphics/characters/piccolo/piccolo-fight.png', 150, 200);

        this.load.image('vegeta-collecting', './assets/graphics/characters/vegeta/vegeta-collecting.png');
        this.load.image('vegeta-card', './assets/graphics/characters/vegeta/vegeta-card.png');
        this.load.image('vegeta', './assets/graphics/characters/vegeta/poster/vegeta.png');
        this.load.image('vegeta-halo', './assets/graphics/characters/vegeta/poster/vegeta-halo.png');
        this.load.spritesheet('vegeta-spritesheet', './assets/graphics/characters/vegeta/vegeta-fight.png', 150, 200);

        // graphics/icons

        this.load.image('mute', './assets/graphics/icons/mute.png');
        this.load.image('unmute', './assets/graphics/icons/unmute.png');

        // graphics/logo

        this.load.image('logo-minimal', './assets/graphics/logo/logo-minimal.png');

        debug.log('images loaded');

        this.load.audio('sound-jump', './assets/sound/dbz/jump.ogg');

        // Use this when character has level less than first threshold.
        this.load.audio('sound-weakkick', './assets/sound/dbz/weakkick.ogg');
        this.load.audio('sound-weakpunch', './assets/sound/dbz/weakpunch.ogg');

        // Use this when character has level less than second threshold.
        this.load.audio('sound-mediumkick', './assets/sound/dbz/mediumkick.ogg');
        this.load.audio('sound-mediumpunch', './assets/sound/dbz/mediumpunch.ogg');

        // Use this when character has level less than max.
        this.load.audio('sound-strongkick', './assets/sound/dbz/strongkick.ogg');
        this.load.audio('sound-strongpunch', './assets/sound/dbz/strongpunch.ogg');

        this.load.audio('sound-ambience-thunder', './assets/sound/dbk/ambience_thunder.ogg');
        this.load.audio('sound-dramatic', './assets/sound/dbk/dramatic_reveal_01.ogg');
        this.load.audio('sound-thing1', './assets/sound/dbk/thing1.ogg');
        this.load.audio('scouter', './assets/sound/dbz/scouter.ogg');

        this.load.audio('scouter', './assets/sound/dbz/scouter.ogg');

        this.load.audio('sound-candypop', './assets/sound/dbz/candypop.ogg');
        this.load.audio('sound-radar', './assets/sound/dbk/devices_02.ogg');

        debug.log('audio loaded');

        this.load.tilemap('collecting-1', './assets/maps/collecting-1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('collecting-2', './assets/maps/collecting-2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('collecting-3', './assets/maps/collecting-3.json', null, Phaser.Tilemap.TILED_JSON);

        debug.log('tilemap loaded');

        this.load.spritesheet('spr-collecting', './assets/graphics/spritesheet/spr-collecting.png', 40, 40);

        debug.log('spritesheet loaded');

        this.load.json('positions-1', './assets/balls/positions-1.json');
        this.load.json('positions-2', './assets/balls/positions-2.json');
        this.load.json('positions-3', './assets/balls/positions-3.json');

        this.load.json('locale-en', './locale/en_EN.json');
        this.load.json('locale-pl', './locale/pl_PL.json');

        debug.log('jsons loaded');

        this.load.text('font-saiyan-sans', './assets/fonts/Saiyan-Sans.ttf');

        debug.log('fonts loaded');
    }

    create() {
        // Delay to display whole progressbar for some time.
        setTimeout(() => this.state.start('SelectLanguage'), DISPLAY_LOADING_DELAY);
    }
};
