let config = require('../constants/configs');
let MUTE_MODES = ['unmute', 'mute'];

function translateState(game) {
    return MUTE_MODES[Number(game.sound.mute)];
}

function loadSoundPreferences(game) {
    let key = config.STORAGE_AUDIO_KEY;

    game.sound.mute = Boolean(Number(localStorage.getItem(key)));

    let mute = game.add.button(game.width - 36, game.height - 36, translateState(game));

    mute.onInputDown.add(() => {
        game.sound.mute = !game.sound.mute;
        localStorage.setItem(key, Number(game.sound.mute));
        mute.loadTexture(translateState(game));
    });
}

module.exports = {
    loadSoundPreferences
};
