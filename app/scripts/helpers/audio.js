let loadSoundPreferences = (game) => {
    let key = 'dbp-sound-mute';
    let modes = ['unmute', 'mute'];
    let translateState = () => modes[Number(game.sound.mute)];

    game.sound.mute = Boolean(Number(localStorage.getItem(key)));

    let mute = game.add.button(game.width - 36, game.height - 36, translateState());

    mute.onInputDown.add(() => {
        game.sound.mute = !game.sound.mute;
        localStorage.setItem(key, Number(game.sound.mute));
        mute.loadTexture(translateState());
    });
};

module.exports = {
    loadSoundPreferences
};
