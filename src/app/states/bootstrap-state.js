let { addTitle, addLabel } = require('../helpers/message');

/**
 * The first screen: it waits for ENTER (or a click). Browsers let a page
 * play sound only after the user did something on it, and the loading
 * screen has the shout of Son Goku.
 */
export default class BootstrapState extends Phaser.State {
    preload() {
        // Assets of the loading screen: Son Goku firing a Kamehameha wave.
        this.load.image('kamehameha', './assets/pixelart/loader/kamehameha.png');
        this.load.image('boulder', './assets/pixelart/loader/boulder.png');
        this.load.spritesheet('explosion', './assets/pixelart/loader/explosion.png', 120, 120);
        this.load.spritesheet('son-goku-fight', './assets/pixelart/fight/son-goku/son-goku-spritesheet.png', 150, 200);
        this.load.image('logo', './assets/pixelart/logo/logo.png');
    }

    create() {
        // Sprites stay on whole pixels, so the pixel art stays sharp.
        this.game.renderer.renderSession.roundPixels = true;
        this.stage.backgroundColor = '#000';
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        // The browser fetches a font only when something uses it, so the font
        // of the game is requested here.
        // Without the font the game still starts, with a fallback one.
        let showStart = () => this._showStart();
        document.fonts.load('10px "Press Start 2P"').then(showStart, showStart);
    }

    _showStart() {
        let centerX = this.game.world.centerX;

        let $logo = this.add.image(centerX, 120, 'logo');
        $logo.anchor.setTo(0.5, 0.5);
        $logo.smoothed = false;

        // The language is not chosen yet, so the hint is in both.
        let $start = addLabel(this.game, centerX, 270, 'press ENTER to start', [0.5, 0]);
        addLabel(this.game, centerX, 304, 'naciśnij ENTER, aby zacząć', [0.5, 0]).fill = '#9aa3b8';

        this.time.events.loop(Phaser.Timer.SECOND / 2, () => {
            $start.visible = !$start.visible;
        });

        let start = () => this.game.emit('game:bootstrap');
        this.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.addOnce(start);
        this.input.onDown.addOnce(start);
    }
};
