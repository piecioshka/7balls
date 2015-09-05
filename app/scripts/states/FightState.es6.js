class FightState extends Phaser.State {
    preload() {
        this.load.image('bg-fight', './assets/graphics/backgrounds/bg-fight.jpg');

        this.load.audio('sfx-jump', './assets/sound/dbz/jump.ogg');

        this.load.audio('sfx-weakkick', './assets/sound/dbz/weakkick.ogg');
        this.load.audio('sfx-weakpunch', './assets/sound/dbz/weakpunch.ogg');

        this.load.audio('sfx-mediumkick', './assets/sound/dbz/mediumkick.ogg');
        this.load.audio('sfx-mediumpunch', './assets/sound/dbz/mediumpunch.ogg');

        this.load.audio('sfx-strongkick', './assets/sound/dbz/strongkick.ogg');
        this.load.audio('sfx-superpunch', './assets/sound/dbz/strongpunch.ogg');

        this.load.audio('sfx-meleemiss1', './assets/sound/dbz/meleemiss1.ogg');
        this.load.audio('sfx-meleemiss2', './assets/sound/dbz/meleemiss2.ogg');
        this.load.audio('sfx-meleemiss3', './assets/sound/dbz/meleemiss3.ogg');
    }

    create() {
        this.add.image(0, 0, 'bg-fight');
    }

    update() {

    }

    render() {

    }
}

export default FightState;
