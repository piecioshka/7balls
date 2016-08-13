let config = require('../configs');
let MUTE_MODES = ['unmute', 'mute'];

function loadSoundPreferences(game) {
    let key = config.STORAGE_AUDIO_KEY;
    let translateState = () => MUTE_MODES[Number(game.sound.mute)];

    game.sound.mute = Boolean(Number(localStorage.getItem(key)));

    let mute = game.add.button(game.width - 36, game.height - 36, translateState());

    mute.onInputDown.add(() => {
        game.sound.mute = !game.sound.mute;
        localStorage.setItem(key, Number(game.sound.mute));
        mute.loadTexture(translateState());
    });
}

module.exports = {
    loadSoundPreferences
};
