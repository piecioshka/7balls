const ROUNDS = require('../constants/rounds');
const { getLocale } = require('./locale');
const TRACKS = require('../constants/tracks');

const VOLUME_KEY = 'm';
const STORAGE_KEY = '7balls:volume';

// Volume modes: off, quiet and loud. The number is the gain of the music.
const VOLUMES = [0, 0.35, 1];
const DEFAULT_VOLUME = VOLUMES.length - 1;
const MENU_TRACK = 'menu';
const SILENT_STATES = ['Bootstrap', 'Loading'];

// How often the notes are scheduled, and how far ahead (seconds).
const TICK = 50;
const LOOKAHEAD = 0.2;

// Soft, dark voices; the music goes through a low-pass filter.
const VOICES = {
    lead: { type: 'triangle', volume: 0.11 },
    bass: { type: 'sawtooth', volume: 0.05 },
    pad: { type: 'sawtooth', volume: 0.025 }
};
const MUSIC_FILTER = 1100;

// Short sounds: parts played one after another. A part is a tone gliding
// from one frequency (Hz) to another, or noise; the length is in seconds.
const SOUNDS = {
    // An option was highlighted.
    select: [{ type: 'square', from: 660, to: 660, duration: 0.06 }],
    // A choice was accepted.
    confirm: [{ type: 'square', from: 660, to: 660, duration: 0.07 }, { type: 'square', from: 990, to: 990, duration: 0.12 }],
    // Blows: a punch is short and higher, a kick is longer and lower.
    punch: [{ type: 'square', from: 260, to: 120, duration: 0.08 }],
    kick: [{ type: 'sawtooth', from: 170, to: 60, duration: 0.16 }],
    // A blow which reached somebody.
    hit: [{ type: 'noise', duration: 0.08, volume: 0.2 }, { type: 'square', from: 110, to: 50, duration: 0.08 }],
    jump: [{ type: 'square', from: 330, to: 700, duration: 0.12 }],
    // The energy wave.
    wave: [{ type: 'sawtooth', from: 180, to: 950, duration: 0.3 }, { type: 'noise', duration: 0.12, volume: 0.12 }],
    // A boulder blowing up.
    explosion: [{ type: 'noise', duration: 0.45, volume: 0.3 }, { type: 'sawtooth', from: 90, to: 30, duration: 0.3 }],
    // A transformation: a rising roar.
    transform: [{ type: 'sawtooth', from: 70, to: 420, duration: 0.45, volume: 0.12 }, { type: 'noise', duration: 0.3, volume: 0.15 }],
    // The player got hurt.
    hurt: [{ type: 'sawtooth', from: 300, to: 90, duration: 0.2 }]
};
const SOUND_VOLUME = 0.09;

// The shout: syllables as a consonant, a vowel, its length (seconds)
// and the pitch of the voice (Hz).
const SHOUT = [
    ['k', 'a', 0.16, 170],
    ['m', 'e', 0.16, 180],
    ['h', 'a', 0.2, 195],
    ['m', 'e', 0.2, 210],
    ['h', 'a', 1.35, 230]
];
// The two strongest resonances of the mouth for a vowel (Hz).
const FORMANTS = { a: [760, 1250], e: [480, 1850] };
const SHOUT_VOLUME = 0.55;

const SEMITONES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/**
 * @param {string} name For example "A4", "F#5" or "Bb2".
 * @returns {number} Frequency in Hz.
 */
function frequencyOf(name) {
    const [, letter, accidental, octave] = name.match(/^([A-G])([#b]?)(\d)$/);
    const shift = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0;
    const midi = (Number(octave) + 1) * 12 + SEMITONES[letter] + shift;

    return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Turns "E5 G5:4 -:2" into notes. The length is given in sixteenth notes,
 * 2 (an eighth note) when omitted; "-" is a rest.
 */
function parseVoice(source) {
    return source.split(/\s+/).filter(Boolean).map((token) => {
        const [name, length] = token.split(':');

        return {
            frequency: name === '-' ? null : frequencyOf(name),
            steps: length ? Number(length) : 2
        };
    });
}

function readVolume() {
    try {
        const saved = Number(window.localStorage.getItem(STORAGE_KEY));
        const isValid = window.localStorage.getItem(STORAGE_KEY) !== null && Number.isInteger(saved) && saved >= 0 && saved < VOLUMES.length;

        return isValid ? saved : DEFAULT_VOLUME;
    } catch (error) {
        return DEFAULT_VOLUME;
    }
}

function saveVolume(volume) {
    try {
        window.localStorage.setItem(STORAGE_KEY, String(volume));
    } catch (error) {
        // The choice is simply not remembered.
    }
}

/**
 * Plays looped chiptune tracks generated with Web Audio: one for the menus
 * and one for every round. Nothing is downloaded.
 */
class Music {
    constructor() {
        this.context = null;
        this.master = null;
        this.timer = null;
        this.track = null;
        this.voices = [];
        // Index of the volume mode, see VOLUMES.
        this.volume = readVolume();
        this.onChange = () => null;
    }

    /**
     * Browsers allow sound only after the user did something on the page.
     */
    unlock() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;

        if (this.context !== null || !AudioContext) {
            return;
        }

        this.context = new AudioContext();
        this.master = this.context.createGain();
        this.master.gain.value = VOLUMES[this.volume];
        this.master.connect(this.context.destination);

        // The music (not the sounds) loses its sharp highs.
        this.musicBus = this.context.createBiquadFilter();
        this.musicBus.type = 'lowpass';
        this.musicBus.frequency.value = MUSIC_FILTER;
        this.musicBus.connect(this.master);

        if (this.track !== null) {
            this._start();
        }
    }

    /**
     * @param {?string} name Name of a track, or null for silence.
     */
    play(name) {
        if (name === this.track) {
            return;
        }

        this.track = name;

        if (this.context !== null) {
            this._start();
        }
    }

    _start() {
        window.clearInterval(this.timer);
        this.voices = [];

        if (this.track === null) {
            return;
        }

        const track = TRACKS[this.track];
        const startTime = this.context.currentTime + 0.05;

        this.stepTime = 60 / track.bpm / 4;
        this.voices = Object.keys(VOICES).map((voice) => ({
            settings: VOICES[voice],
            notes: parseVoice(track[voice]),
            index: 0,
            time: startTime
        }));

        this.timer = window.setInterval(() => this._schedule(), TICK);
        this._schedule();
    }

    _schedule() {
        const horizon = this.context.currentTime + LOOKAHEAD;

        this.voices.forEach((voice) => {
            while (voice.time < horizon) {
                const note = voice.notes[voice.index];
                const duration = note.steps * this.stepTime;

                if (note.frequency !== null) {
                    this._playNote(voice.settings, note.frequency, voice.time, duration);
                }

                voice.time += duration;
                voice.index = (voice.index + 1) % voice.notes.length;
            }
        });
    }

    _playNote({ type, volume }, frequency, time, duration) {
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        // A short attack and a fade out, so the notes do not click.
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(volume, time + 0.01);
        gain.gain.linearRampToValueAtTime(0, time + duration * 0.9);

        oscillator.connect(gain);
        gain.connect(this.musicBus);
        oscillator.start(time);
        oscillator.stop(time + duration);
    }

    /**
     * Plays a short sound of the interface, at the volume of the music.
     *
     * @param {string} name One of the keys of SOUNDS.
     */
    playSound(name) {
        if (this.context === null) {
            return;
        }

        let time = this.context.currentTime;

        SOUNDS[name].forEach((part) => {
            this._playPart(part, time);
            time += part.duration;
        });
    }

    _playPart({ type, from, to, duration, volume = SOUND_VOLUME }, time) {
        const gain = this.context.createGain();
        let source;

        if (type === 'noise') {
            const length = Math.ceil(this.context.sampleRate * duration);
            const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
            const samples = buffer.getChannelData(0);

            for (let index = 0; index < length; index++) {
                samples[index] = Math.random() * 2 - 1;
            }

            source = this.context.createBufferSource();
            source.buffer = buffer;
        } else {
            source = this.context.createOscillator();
            source.type = type;
            source.frequency.setValueAtTime(from, time);
            source.frequency.linearRampToValueAtTime(to, time + duration);
        }

        gain.gain.setValueAtTime(volume, time);
        gain.gain.linearRampToValueAtTime(0, time + duration);

        source.connect(gain);
        gain.connect(this.master);
        source.start(time);
        source.stop(time + duration);
    }

    /**
     * The shout "KA-ME-HA-ME-HAAAAA!": a rough voice made of a buzzing
     * tone shaped like vowels, with bursts of noise for the consonants.
     *
     * @returns {number} Length of the shout in seconds, 0 without sound.
     */
    shout() {
        if (this.context === null) {
            return 0;
        }

        let time = this.context.currentTime + 0.05;
        const start = time;

        SHOUT.forEach(([consonant, vowel, duration, pitch]) => {
            time += this._playConsonant(consonant, time, pitch);
            this._playVowel(vowel, time, duration, pitch);
            time += duration;
        });

        return time - start;
    }

    _playConsonant(consonant, time, pitch) {
        const gain = this.context.createGain();
        const filter = this.context.createBiquadFilter();
        let source;
        let duration;

        if (consonant === 'm') {
            // A hum through the nose.
            duration = 0.06;
            source = this.context.createOscillator();
            source.type = 'sawtooth';
            source.frequency.value = pitch;
            filter.type = 'lowpass';
            filter.frequency.value = 350;
        } else {
            // "k" is a short click, "h" a longer breath.
            duration = consonant === 'k' ? 0.035 : 0.07;
            source = this._noise(duration);
            filter.type = consonant === 'k' ? 'highpass' : 'bandpass';
            filter.frequency.value = consonant === 'k' ? 1800 : 1300;
        }

        source.connect(filter);
        filter.connect(gain);
        gain.gain.setValueAtTime(SHOUT_VOLUME * 0.8, time);
        gain.gain.linearRampToValueAtTime(0, time + duration);
        gain.connect(this.master);
        source.start(time);
        source.stop(time + duration);

        return duration;
    }

    _playVowel(vowel, time, duration, pitch) {
        const source = this.context.createOscillator();
        const gain = this.context.createGain();
        const isLong = duration > 0.5;

        source.type = 'sawtooth';
        source.frequency.setValueAtTime(pitch, time);
        // The last, long "AAAA" rises and shakes.
        source.frequency.linearRampToValueAtTime(pitch * (isLong ? 1.35 : 1.05), time + duration);

        if (isLong) {
            const vibrato = this.context.createOscillator();
            const depth = this.context.createGain();
            vibrato.frequency.value = 7;
            depth.gain.value = 9;
            vibrato.connect(depth);
            depth.connect(source.frequency);
            vibrato.start(time);
            vibrato.stop(time + duration);
        }

        FORMANTS[vowel].forEach((frequency) => {
            const filter = this.context.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = frequency;
            filter.Q.value = 6;
            source.connect(filter);
            filter.connect(gain);
        });

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(SHOUT_VOLUME, time + 0.02);
        gain.gain.setValueAtTime(SHOUT_VOLUME, time + duration * 0.8);
        gain.gain.linearRampToValueAtTime(0, time + duration);
        gain.connect(this.master);
        source.start(time);
        source.stop(time + duration);
    }

    _noise(duration) {
        const length = Math.ceil(this.context.sampleRate * duration);
        const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
        const samples = buffer.getChannelData(0);

        for (let index = 0; index < length; index++) {
            samples[index] = Math.random() * 2 - 1;
        }

        const source = this.context.createBufferSource();
        source.buffer = buffer;

        return source;
    }

    /**
     * Switches to the next volume mode: loud, quiet, off, loud...
     */
    changeVolume() {
        this.volume = (this.volume + VOLUMES.length - 1) % VOLUMES.length;
        saveVolume(this.volume);

        if (this.master !== null) {
            this.master.gain.value = VOLUMES[this.volume];
        }

        this.onChange();
    }

    /**
     * Stops the time of the music, for example when the game is paused.
     */
    setPaused(isPaused) {
        if (this.context === null) {
            return;
        }

        if (isPaused) {
            this.context.suspend();
        } else {
            this.context.resume();
        }
    }
}

/**
 * @param {Phaser.Game} game
 * @param {string} state Name of the game state.
 * @returns {?string} Name of the track for the state.
 */
function trackOf(game, state) {
    if (SILENT_STATES.includes(state)) {
        return null;
    }

    const round = ROUNDS[game.round];

    return round && round.state === state ? round.music : MENU_TRACK;
}

/**
 * Plays music matching the current screen, and lets the player change
 * its volume (loud, quiet, off) with the M key or the button in the corner
 * of the game area.
 *
 * @param {Phaser.Game} game
 * @returns {Music}
 */
export function setupMusic(game) {
    const music = new Music();
    const $button = document.getElementById('music-toggle');

    function updateButton() {
        const locale = getLocale(game);

        $button.dataset.volume = String(music.volume);

        if (locale) {
            const label = locale.MUSIC_VOLUME[music.volume];
            $button.setAttribute('aria-label', label);
            $button.title = label;
        }
    }

    music.onChange = updateButton;
    game.on('locale:select', updateButton);
    game.state.onStateChange.add((state) => music.play(trackOf(game, state)));

    // Phaser creates the pause signals when it boots, not earlier.
    game.on('game:bootstrap', () => {
        updateButton();
        game.onPause.add(() => music.setPaused(true));
        game.onResume.add(() => music.setPaused(false));
    });

    ['keydown', 'pointerdown'].forEach((name) => {
        window.addEventListener(name, () => music.unlock(), { once: true });
    });

    window.addEventListener('keydown', (event) => {
        const hasModifier = event.ctrlKey || event.metaKey || event.altKey;

        if (event.key.toLowerCase() === VOLUME_KEY && !hasModifier && !event.repeat) {
            music.changeVolume();
        }
    });

    $button.addEventListener('click', () => {
        music.changeVolume();

        // Without this the focused button would react to Space and Enter,
        // which are used to play.
        $button.blur();
    });

    return music;
}
