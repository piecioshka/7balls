let utils = require('../helpers/utils');
let { addSaiyanLabel } = require('../helpers/message');
let { displayGameVersion } = require('../helpers/message');

// Czas opóźnienia do schowania paska postępu.
const DISPLAY_LOADING_DELAY = 500;

export default class LoadingState extends Phaser.State {
    preload() {
        let title = addSaiyanLabel(this.game, this.world.centerX, 150, 'Loading...', [0.5, 0.5]);
        title.fontSize = 130;

        let pixelLoadingWidth = this.cache.getImage('pixel-loading').width;
        let progressBar = this.add.sprite(this.world.centerX - (pixelLoadingWidth / 2), 230, 'pixel-loading');
        this.load.setPreloadSprite(progressBar);

        // graphics/characters
        this.load.path = './assets/graphics/characters/';

        this.load.image('son-goku-collecting', 'son-goku/son-goku-collecting.png');
        this.load.spritesheet('son-goku-spritesheet', 'son-goku/son-goku-fight.png', 150, 200);

        this.load.image('vegeta-collecting', 'vegeta/vegeta-collecting.png');
        this.load.spritesheet('vegeta-spritesheet', 'vegeta/vegeta-fight.png', 150, 200);

        // graphics/monsters
        this.load.path = './assets/graphics/monsters/';

        this.load.image('bubu-card', 'bubu/bubu-card.png');
        this.load.spritesheet('bubu-spritesheet', 'bubu/bubu-fight.png', 150, 200);

        this.load.image('cell-card', 'cell/cell-card.png');
        this.load.spritesheet('cell-spritesheet', 'cell/cell-fight.png', 150, 200);

        this.load.image('freeza-card', 'freeza/freeza-card.png');
        this.load.spritesheet('freeza-spritesheet', 'freeza/freeza-fight.png', 150, 200);

        this.load.image('piccolo-card', 'piccolo/piccolo-card.png');
        this.load.spritesheet('piccolo-spritesheet', 'piccolo/piccolo-fight.png', 150, 200);

        this.load.path = '';

        this.load.tilemap('map-collecting-1', './assets/data/maps/collecting-1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('map-collecting-2', './assets/data/maps/collecting-2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('map-collecting-3', './assets/data/maps/collecting-3.json', null, Phaser.Tilemap.TILED_JSON);

        // ---
        this.load.path = 'assets/pixelart/';

        this.load.image('pixel', 'pixel.png');
        this.load.image('logo', 'logo/logo.png');
        this.load.image('flag-pl', 'flags/flag-pl.png');
        this.load.image('flag-usa', 'flags/flag-usa.png');
        this.load.image('cloud', 'cloud.png');

        this.load.image('bg-game-over', 'backgrounds/game-over/game-over.png');
        this.load.image('bg-win', 'backgrounds/win/win.png');
        this.load.image('bg-credits', 'backgrounds/credits/credits.png');
        this.load.image('bg-select-player', 'backgrounds/select-player/select-player.png');

        this.load.image('son-goku-card', 'posters/son-goku/son-goku-card.png');
        this.load.image('vegeta-card', 'posters/vegeta/vegeta-card.png');

        this.load.spritesheet('collect-spritesheet', 'sheets/collect-spritesheet.png', 40, 40);
        this.load.spritesheet('ball-spritesheet', 'sheets/ball-spritesheet.png', 40, 40);

        this.load.image('bar-blank', 'bars/blank.png');
        this.load.image('bar-exp', 'bars/exp.png');
        this.load.image('bar-exp-invert', 'bars/exp-invert.png');
        this.load.image('bar-hp', 'bars/hp.png');
        this.load.image('bar-hp-invert', 'bars/hp-invert.png');

        this.load.path = '';

        this.load.json('positions-1', './assets/data/balls-positions/positions-1.json');
        this.load.json('positions-2', './assets/data/balls-positions/positions-2.json');
        this.load.json('positions-3', './assets/data/balls-positions/positions-3.json');

        this.load.json('locale-en', './assets/locale/en_EN.json');
        this.load.json('locale-pl', './assets/locale/pl_PL.json');

        this.load.text('font-saiyan-sans', './assets/fonts/Saiyan-Sans.ttf');
    }

    create() {
        // Opóźnienie, aby wyświetlić przez chwilkę cały progressBar.
        utils.timeout(this, DISPLAY_LOADING_DELAY, () => {
            this.game.emit('game:loaded')
        });

        displayGameVersion(this.game);
    }
};
