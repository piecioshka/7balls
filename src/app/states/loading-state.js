let utils = require('../helpers/utils');
const COLLECT = require('../constants/collect');
const POWER = require('../constants/power');
let { addTitle, addLabel } = require('../helpers/message');
let { displayGameVersion } = require('../helpers/message');

// Time to watch the explosion before the game goes on.
const DISPLAY_LOADING_DELAY = 1400;

// Every character has a card and a fight spritesheet.
const CHARACTERS = [
    'son-goku', 'vegeta', 'gohan', 'goten', 'trunks', 'piccolo', 'krillin', 'yamcha', 'tien', 'mr-satan',
    'cell', 'cell-jr', 'bubu', 'freeza', 'beerus', 'whis', 'c-16', 'c-17', 'c-18'
];

// What Son Goku shouts while he fires the wave, and when the syllables
// appear (milliseconds), in time with the voice.
const SHOUT = ['KA', 'ME', 'HA', 'ME', 'HAAAAA'];
const SHOUT_TIMES = [0, 200, 400, 670, 940];
// The boulder explodes during the long "HAAAAA", even when loading is quick.
const MIN_EXPLOSION_TIME = 1500;

const GOKU_X = 60;
const GOKU_Y = 150;
const GOKU_FIRING_FRAME = 4;
const GOKU_STANDING_FRAME = 0;

// Position of the fist inside the sprite frame.
const FIST_X = 145;
const FIST_Y = 82;
// Length of the wave when everything is loaded.
const WAVE_LENGTH = 500;

export default class LoadingState extends Phaser.State {
    $boulder = null;
    $wave = null;
    $goku = null;
    startedAt = 0;

    preload() {
        addTitle(this.game, this.world.centerX, 80, 'Loading...', [0.5, 0.5]);

        // Son Goku with a stretched arm. The wave coming out of his fist
        // is the progress bar: it grows as the assets are loaded.
        this.$goku = this.add.sprite(GOKU_X, GOKU_Y, 'son-goku-fight', GOKU_FIRING_FRAME);

        // The wave flies to a boulder, which explodes when everything is loaded.
        this.$boulder = this.add.image(GOKU_X + FIST_X + WAVE_LENGTH - 10, GOKU_Y + FIST_Y, 'boulder');
        this.$boulder.anchor.setTo(0, 0.5);

        this.$wave = this.add.sprite(GOKU_X + FIST_X, GOKU_Y + FIST_Y, 'kamehameha');
        this.$wave.anchor.setTo(0, 0.5);
        this.load.setPreloadSprite(this.$wave);

        // The shout of Son Goku, one syllable after another.
        let $shout = addLabel(this.game, GOKU_X + FIST_X + 20, GOKU_Y + 40, '');
        $shout.fill = '#ffe600';

        SHOUT_TIMES.forEach((delay, index) => {
            this.time.events.add(delay, () => {
                let count = index + 1;
                $shout.setText(SHOUT.slice(0, count).join('-') + (count === SHOUT.length ? '!' : ''));
            });
        });

        this.startedAt = this.time.now;
        this.game.music.shout();

        this.load.path = '';

        for (let map = 1; map <= COLLECT.MAPS; map++) {
            this.load.tilemap(`map-collecting-${map}`, `./assets/data/maps/collecting-${map}.json`, null, Phaser.Tilemap.TILED_JSON);
            this.load.json(`positions-${map}`, `./assets/data/balls-positions/positions-${map}.json`);
        }

        // ---
        this.load.path = 'assets/pixelart/';

        this.load.image('pixel', 'pixel.png');
        this.load.image('cloud', 'cloud.png');
        this.load.image('kinto', 'kinto.png');
        this.load.image('beam', 'beam.png');

        this.load.image('bg-game-over', 'backgrounds/game-over/game-over.png');
        this.load.image('bg-win', 'backgrounds/win/win.png');
        this.load.image('bg-credits', 'backgrounds/credits/credits.png');
        this.load.image('bg-select-player', 'backgrounds/select-player/select-player.png');
        ['namek', 'wasteland', 'city', 'beerus', 'tournament'].forEach((name) => {
            this.load.image(`bg-${name}`, `backgrounds/${name}.png`);
        });

        CHARACTERS.forEach((id) => {
            this.load.image(`${id}-card`, `posters/${id}/${id}-card.png`);
            this.load.image(`${id}-avatar`, `posters/${id}/${id}-avatar.png`);
            this.load.spritesheet(`${id}-fight`, `fight/${id}/${id}-spritesheet.png`, 150, 200);
            this.load.spritesheet(`${id}-mini`, `fight/${id}/${id}-mini-spritesheet.png`, 60, 60);
            this.load.spritesheet(`${id}-flight`, `fight/${id}/${id}-flight-spritesheet.png`, 120, 120);
            this.load.spritesheet(`${id}-aura`, `fight/${id}/${id}-aura-spritesheet.png`, 150, 200);
            this.load.spritesheet(`${id}-big-aura`, `fight/${id}/${id}-big-aura-spritesheet.png`, 150, 200);
        });

        POWER.SAIYAN_FORMS.forEach(({ name, ids }) => {
            ids.forEach((id) => {
                this.load.spritesheet(`${id}-${name}-fight`, `fight/${id}/${id}-${name}-spritesheet.png`, 150, 200);
                this.load.image(`${id}-${name}-avatar`, `posters/${id}/${id}-${name}-avatar.png`);
            });
        });

        this.load.spritesheet('collect-spritesheet', 'sheets/collect-spritesheet.png', 40, 40);
        this.load.spritesheet('ball-spritesheet', 'sheets/ball-spritesheet.png', 35, 35);
        this.load.spritesheet('star-balls-spritesheet', 'sheets/star-balls-spritesheet.png', 45, 45);

        this.load.image('bar-blank', 'bars/blank.png');
        this.load.image('bar-exp', 'bars/exp.png');
        this.load.image('bar-exp-invert', 'bars/exp-invert.png');
        this.load.image('bar-hp', 'bars/hp.png');
        this.load.image('bar-hp-invert', 'bars/hp-invert.png');

        this.load.path = '';

        this.load.json('locale-en', './assets/locale/en_EN.json');
        this.load.json('locale-pl', './assets/locale/pl_PL.json');

    }

    create() {
        let wait = Math.max(0, MIN_EXPLOSION_TIME - (this.time.now - this.startedAt));

        utils.timeout(this, wait, () => {
            this._explode();

            // Time to watch the explosion before the game goes on.
            utils.timeout(this, DISPLAY_LOADING_DELAY, () => {
                this.game.emit('game:loaded');
            });
        });

        displayGameVersion(this.game);
    }

    _explode() {
        let x = this.$boulder.x + this.$boulder.width / 2;
        let y = this.$boulder.y;
        let $explosion = this.add.sprite(x, y, 'explosion');

        $explosion.anchor.setTo(0.5, 0.5);
        $explosion.animations.add('boom', [0, 1, 2, 3, 4, 5], 12, false).play();
        $explosion.animations.currentAnim.onComplete.add(() => $explosion.destroy());

        this.$boulder.destroy();

        // The wave is gone after the blast, and Son Goku stands again.
        this.add.tween(this.$wave).to({ alpha: 0 }, 250, Phaser.Easing.Linear.None, true);
        this.$goku.frame = GOKU_STANDING_FRAME;
        this.camera.shake(0.02, 400);
        this.game.music.playSound('explosion');
    }
};
