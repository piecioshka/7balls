const { FRAMES, frameOf } = require('../../helpers/sprites');
const { addTitle, addLabel, addRepeatLink } = require('../../helpers/message');

// Everybody who appears in the game, in the order of landing. Son Goku
// lands in the middle of the front row and stands in front of everybody.
const CAST = [
    'piccolo', 'tien', 'yamcha', 'krillin', 'mr-satan', 'vegeta', 'gohan', 'goten', 'trunks',
    'son-goku', 'whis', 'beerus', 'freeza', 'c-17', 'c-18', 'c-16', 'cell', 'bubu'
];
const HERO = 'son-goku';
// Everybody at full size, in two rows.
const FIRST_X = 55;
const SPACING = 82;
const BACK_ROW_Y = 314;
const GROUND_Y = 322;
// They fly in from the right (a jump looking to the left) and face
// the viewer after landing.
const FLYING_FRAME = frameOf(FRAMES.JUMP, 'left');
const STANDING_FRAME = FRAMES.FRONT;
const FLIGHT_TIME = 700;
const FLIGHT_DELAY = 300;

export default class CreditsState extends Phaser.State {
    create() {
        const centerX = this.game.world.centerX;

        this.add.image(0, 0, 'bg-credits');

        addTitle(this.game, centerX, 10, this.game.locale.CREDITS, [0.5, 0]);

        addLabel(this.game, centerX, 40, this.game.locale.DEVELOPED_BY, [0.5, 0]);
        addLabel(this.game, centerX, 64, 'Piotr Kowalski', [0.5, 0]);
        addLabel(this.game, centerX, 88, '@piecioshka', [0.5, 0]);

        this._setupCast();

        const $repeat = addRepeatLink(this.game);
        $repeat.events.onInputDown.add(this._tryAgain, this);

        this._setupKeyboard();
    }

    /**
     * The cast flies in one after another and lines up on the ground.
     */
    _setupCast() {
        const $sprites = CAST.map((id, index) => this._addCastMember(id, index));

        // The front row covers the back one, and Son Goku covers everybody.
        $sprites.filter(($sprite, index) => index % 2 === 1).forEach(($sprite) => $sprite.bringToTop());
        $sprites[CAST.indexOf(HERO)].bringToTop();
    }

    _addCastMember(id, index) {
        const $character = this.add.sprite(this.game.width + 100, -60, `${id}-fight`, FLYING_FRAME);
        // Two rows: the back one stands higher.
        const isBack = index % 2 === 0;
        const column = Math.floor(index / 2);

        $character.anchor.setTo(0.5, 1);
        $character.smoothed = false;

        const flight = this.add.tween($character).to({
            x: FIRST_X + column * SPACING + (isBack ? 0 : SPACING / 2),
            y: isBack ? BACK_ROW_Y : GROUND_Y
        }, FLIGHT_TIME, Phaser.Easing.Quadratic.Out, true, index * FLIGHT_DELAY);

        flight.onComplete.add(() => {
            $character.frame = STANDING_FRAME;
            this.game.music.playSound('select');
        });

        return $character;
    }

    _setupKeyboard() {
        const enter = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        // Wstrzymujemy propagację zdarzeń w oknie przeglądarki.
        this.input.keyboard.addKeyCapture([
            Phaser.Keyboard.ENTER
        ]);

        enter.onDown.add(() => this._tryAgain());
    }

    _tryAgain() {
        this.game.music.playSound('confirm');
        this.game.emit('game:new');
    }
}
