'use strict';

// Music of the game, written for helpers/music.js: dark tunes in minor keys,
// played low and through a filter which takes away the sharp highs.
// A voice is a list of notes separated by spaces: "E4" is an eighth note,
// "E4:4" lasts four sixteenth notes, "-:2" is a rest. Every line below
// is one bar (16 sixteenth notes) and all voices of a track have 4 bars.
// "lead" is the melody, "bass" the low line, "pad" long background chords.
const bars = (...lines) => lines.join(' ');

module.exports = {
    // Menus, introductions and summaries: a slow, gloomy theme in D minor.
    menu: {
        bpm: 72,
        lead: bars('D4:4 F4:4 A4:6 G4:2', 'F4:4 E4:4 D4:8', 'Bb3:4 D4:4 F4:6 E4:2', 'A3:12 -:4'),
        bass: bars('D2:16', 'Bb1:16', 'G1:16', 'A1:16'),
        pad: bars('A3:16', 'F3:16', 'D3:16', 'C#3:16')
    },

    // Round 1, dragon balls in the dark: a tense arpeggio in A minor.
    collect: {
        bpm: 110,
        lead: bars('A3 C4 E4 A4 G4 E4 C4 E4', 'F3 A3 C4 F4 E4 C4 A3 C4', 'D3 F3 A3 D4 C4 A3 F3 A3', 'E3 G#3 B3 E4 D4 B3 G#3:4'),
        bass: bars('A2:4 A2:4 A2:4 A2:4', 'F2:4 F2:4 F2:4 F2:4', 'D2:4 D2:4 D2:4 D2:4', 'E2:4 E2:4 E2:4 E2:4'),
        pad: bars('E3:16', 'C3:16', 'A2:16', 'B2:16')
    },

    // Round 2, Freeza: a cold, slow menace in B minor.
    tyrant: {
        bpm: 120,
        lead: bars('B3:2 -:2 B3:2 D4:2 C#4:4 -:4', 'F#3:2 -:2 F#3:2 A3:2 G3:8', 'B3:2 -:2 B3:2 D4:2 F#4:4 E4:4', 'D4:4 C#4:4 A#3:8'),
        bass: bars('B1 B1 B2 B1 B1 B1 B2 B1', 'G1 G1 G2 G1 G1 G1 G2 G1', 'E2 E2 E3 E2 E2 E2 E3 E2', 'F#1 F#1 F#2 F#1 F#1 F#1 F#2 F#1'),
        pad: bars('D3:16', 'B2:16', 'G2:16', 'C#3:16')
    },

    // Round 3, the flight: an eerie, floating theme in E minor.
    flight: {
        bpm: 100,
        lead: bars('E4:6 G4:2 F#4:4 D4:4', 'B3:8 -:8', 'C4:6 E4:2 D4:4 B3:4', 'A3:8 B3:8'),
        bass: bars('E2:8 E2:8', 'G2:8 G2:8', 'C2:8 C2:8', 'B1:8 B1:8'),
        pad: bars('B2:16', 'D3:16', 'G2:16', 'F#2:16')
    },

    // Round 4, the androids: a cold, mechanical pulse in F# minor.
    androids: {
        bpm: 124,
        lead: bars('F#3:2 -:2 F#3:2 -:2 A3:2 G#3:2 F#3:4', 'D3:2 -:2 D3:2 -:2 F#3:2 E3:2 D3:4', 'F#3:2 -:2 F#3:2 -:2 C#4:2 B3:2 A3:4', 'G#3:4 A3:4 C#3:8'),
        bass: bars('F#1 F#1 F#1 F#1 F#1 F#1 F#1 F#1', 'D2 D2 D2 D2 D2 D2 D2 D2', 'F#1 F#1 F#1 F#1 A1 A1 A1 A1', 'C#2 C#2 C#2 C#2 C#2 C#2 C#2 C#2'),
        pad: bars('C#3:16', 'A2:16', 'C#3:16', 'G#2:16')
    },

    // Round 5, Cell: a sinister phrygian riff in A.
    final: {
        bpm: 130,
        lead: bars('A3 Bb3 A3 -:2 A3 Bb3 C4 Bb3', 'A3 Bb3 A3 -:2 G3 F3 E3:4', 'D4 Eb4 D4 -:2 D4 Eb4 F4 Eb4', 'D4 C4 Bb3 A3 Bb3:8'),
        bass: bars('A1 A1 A2 A1 A1 A1 Bb1 A1', 'A1 A1 A2 A1 G1 G1 F1 E1', 'D2 D2 D3 D2 D2 D2 Eb2 D2', 'D2 D2 C2 C2 Bb1 Bb1 A1 A1'),
        pad: bars('E3:16', 'E3:16', 'A2:16', 'F2:16')
    },

    // Round 6, defending the friend: an urgent pulse in D minor.
    defend: {
        bpm: 140,
        lead: bars('D4 D4 F4 D4 E4 D4 C4 A3', 'Bb3:4 A3:4 G3:4 A3:4', 'D4 D4 F4 D4 G4 F4 E4 C4', 'D4:8 -:8'),
        bass: bars('D2 D2 D2 D2 D2 D2 D2 D2', 'Bb1 Bb1 Bb1 Bb1 Bb1 Bb1 Bb1 Bb1', 'G1 G1 G1 G1 A1 A1 A1 A1', 'D2 D2 D2 D2 D2 D2 D2 D2'),
        pad: bars('A3:16', 'F3:16', 'Bb2:8 C#3:8', 'D3:16')
    },

    // Round 7, Bubu: a twisted, childish tune in G minor.
    duel: {
        bpm: 115,
        lead: bars('G3 Bb3 D4 Bb3 Eb4:4 D4:4', 'C4 Eb4 G4 Eb4 F#4:8', 'G3 Bb3 D4 Bb3 Eb4:4 D4:4', 'A3 C4 Bb3 A3 G3:8'),
        bass: bars('G1:4 D2:4 G1:4 D2:4', 'C2:4 G2:4 D2:4 A1:4', 'G1:4 D2:4 Eb2:4 Bb1:4', 'D2:4 A1:4 G1:8'),
        pad: bars('D3:16', 'Eb3:8 D3:8', 'G2:16', 'F#2:16')
    },

    // Round 8, the training with Whis: calm but cold, in F minor.
    training: {
        bpm: 96,
        lead: bars('F3:4 Ab3:4 C4:4 Bb3:4', 'Ab3:4 G3:4 F3:8', 'Db4:4 C4:4 Bb3:4 Ab3:4', 'G3:12 -:4'),
        bass: bars('F2:16', 'Db2:16', 'Bb1:16', 'C2:16'),
        pad: bars('C3:16', 'Ab2:16', 'F2:16', 'E2:16')
    },

    // Round 9, Beerus: a heavy march in C minor.
    god: {
        bpm: 104,
        lead: bars('C4:4 -:2 C4:2 Eb4:4 D4:4', 'Ab3:8 G3:8', 'C4:4 -:2 C4:2 G4:4 F4:4', 'Eb4:4 D4:4 B3:8'),
        bass: bars('C2:2 C2:2 -:4 C2:2 C2:2 -:4', 'Ab1:2 Ab1:2 -:4 G1:2 G1:2 -:4', 'C2:2 C2:2 -:4 C2:2 C2:2 -:4', 'G1:2 G1:2 -:4 G1:2 G1:2 -:4'),
        pad: bars('G2:16', 'Eb2:16', 'G2:16', 'D2:16')
    },

    // Round 10, the Tournament of Power: fast and grim, in E minor.
    tournament: {
        bpm: 150,
        lead: bars('E4 E4 G4 E4 B4 A4 G4 F#4', 'E4:8 D4:8', 'C4 C4 E4 C4 G4 F#4 E4 D4', 'B3:8 D#4:8'),
        bass: bars('E2 E2 E2 E2 E2 E2 E2 E2', 'D2 D2 D2 D2 D2 D2 D2 D2', 'C2 C2 C2 C2 C2 C2 C2 C2', 'B1 B1 B1 B1 B1 B1 B1 B1'),
        pad: bars('B2:16', 'A2:16', 'G2:16', 'F#2:16')
    }
};
