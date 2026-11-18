'use strict';

// Heads of the characters drawn by hand, pixel by pixel, for the frames
// of a fight (30x40 pixels). A head is made of layers: the face, then
// the hair or other details on top of it. Every layer is a template:
// rows of letters and the pixel of the template placed in the middle
// of the head ("anchor"). Side views look to the right. A template given
// as "half" is the left half of a symmetric one (seen from the front).
//
// Letters:
//   .  nothing (what is below stays)
//   s S l  skin, its shadow and light; k a line on the skin (brows, mouth)
//   w p  white of an eye and its pupil
//   h H L  hair, its shadow and light
//   a A q  the material named by "accent" of the layer, shadow and light
//   b B  the material named by "second" of the layer, and its shadow
//   o  the dark outline
//
// In the hair templates, the face lies at columns 6-16 and rows 6-15
// (side view) or at columns 5-16 and rows 6-15 (front view); the eyes
// are in rows 11-12.

const FACE_SIDE = {
    anchor: [4, 5],
    rows: [
        '..ssssss..',
        '.ssssssss.',
        'ssssssssss',
        'ssssssssss',
        'sssssskkk.',
        'sSSssswwps',
        'sSSsssswps',
        'Ssssssssss.',
        '.SSssskSs.',
        '...SSSSS..'
    ]
};

const FACE_FRONT = {
    anchor: [5, 5],
    rows: [
        '...ssssss...',
        '..ssssssss..',
        '.ssssssssss.',
        '.ssssssssss.',
        '.skkssssskk.',
        'Sswwpssspwws',
        'Sswwpssspwws',
        '.sssssSssss.',
        '..ssskksss..',
        '...SSSSSS...'
    ]
};

/**
 * The same face with the eyes closed (hurt) or squinted (Bubu).
 */
function closeEyes(face) {
    return {
        ...face,
        rows: face.rows.map((row, index) => {
            if (index === 5) {
                return row.replace(/[wp]/g, 's');
            }

            return index === 6 ? row.replace(/[wp]/g, 'k') : row;
        })
    };
}

/**
 * The face without eyebrows (Super Saiyan 3).
 */
function withoutBrows(face) {
    return { ...face, rows: face.rows.map((row, index) => (index === 4 ? row.replace(/k/g, 's') : row)) };
}

/**
 * A symmetric template from its left half: the middle of the head lies
 * between its last column and the mirrored one.
 */
function symmetric(half, extra = {}) {
    return {
        anchor: [10, 11],
        rows: half.map((row) => {
            const left = row.padEnd(11, '.');
            return left + [...left].reverse().join('');
        }),
        ...extra
    };
}

const side = (rows, extra = {}) => ({ anchor: [10, 11], rows, ...extra });
const front = (rows, extra = {}) => ({ anchor: [10, 11], rows, ...extra });

// --- Hair ---

const GOKU = {
    side: side([
        '........L.....L.....',
        '.......Lh....Lh.....',
        '..L...Lhh...Lhh..L..',
        '..hL.Lhhh..Lhhh.Lh..',
        '...hhhhhhhhhhhhhhh..',
        'LHhhhhhhhhhhhhhhhhH.',
        '.HHhhhhhhhhhhhhhhhhH',
        '..HHhhhhhhhhhh.hh.h.',
        '...Hhhhhhhh.hh..h...',
        '....hhhhh...h.......',
        '....Hhhh............',
        '.....Hh.............'
    ]),
    front: front([
        '.....L.....L....L...',
        '....Lh....Lh...Lh...',
        '.L..hh...Lhh...hh..L',
        '.hL.hhh.Lhhh..hhh.Lh',
        '..hhhhhhhhhhhhhhhhh.',
        'Hhhhhhhhhhhhhhhhhhhh',
        '.hhhhhhhhhhhhhhhhhh.',
        '..hhhh.hhhhhh.hhhh..',
        '..hhh..hh.hh..hhh...',
        '..hh....h..h....hh..',
        '..h..............h..'
    ])
};

// Super Saiyan: the same hair with every spike pointing up.
const GOKU_SSJ = {
    side: side([
        '....L....L....L.....',
        '....hL..Lh...Lh.....',
        '.L..hh..hh..Lhh..L..',
        '.hL.hhh.hhh.hhh.Lh..',
        '..hhhhhhhhhhhhhhhh..',
        '..hhhhhhhhhhhhhhhhh.',
        '.HhhhhhhhhhhhhhhhhhH',
        '..HhhhhhhhhhhhhhhhhH',
        '...Hhhhhhhhhhh.hh.h.',
        '...HHhhhhhh.hh..h...',
        '....HHhhh...h.......',
        '.....HHh............'
    ]),
    front: symmetric([
        '....L....L.',
        '....hL...hL',
        '.L..hh..hhh',
        '.hL.hhh.hhh',
        '.hhhhhhhhhh',
        'Hhhhhhhhhhh',
        '.hhhhhhhhhh',
        '..hhhh.hhhh',
        '..hhh..hh.h',
        '..hh....h..',
        '..h........'
    ])
};

// Super Saiyan 3: a mane falling down to the middle of the back.
const MANE_SIDE = [
    '.........L....L.....',
    '........Lh...Lh.....',
    '..L....Lhh..Lhh.....',
    '..hL..Lhhh.Lhhh.L...',
    '.Lhhhhhhhhhhhhhhhh..',
    'Lhhhhhhhhhhhhhhhhhh.',
    'hhhhhhhhhhhhhhhhhhhH',
    'hhhhhhhhhhhhhhhhhhhH',
    'hhhhhhhhhhhhh.hh.h..',
    'hhhhhhhhhhh.hh......',
    'hhhhhhhh............',
    'hhhhhhH.............',
    'hhhhhhH.............',
    'hhhhhH..............',
    'Hhhhhh..............',
    '.hhhhH..............',
    '.hhhhh..............',
    '.Hhhhh..............',
    '..hhhH..............',
    '..hhhh..............',
    '..Hhhh..............',
    '...hhH..............',
    '...Hhh..............',
    '....hH..............',
    '....H...............'
];

const GOKU_SSJ3 = {
    side: side(MANE_SIDE),
    front: symmetric([
        '.....L.....',
        '....Lh.....',
        '...Lhh..L..',
        '..Lhhh.Lhh.',
        '.Lhhhhhhhhh',
        'Lhhhhhhhhhh',
        'hhhhhhhhhhh',
        'hhhhhhhhhhh',
        'hhhhhh.hhhh',
        'hhhhh......',
        'hhhh.......',
        'hhh........',
        'hhH........',
        'hhH........',
        'hhH........',
        'Hhh........',
        'hhH........',
        'hh.........',
        'Hh.........',
        'h..........'
    ])
};

const VEGETA = {
    side: side([
        '..........L.........',
        '.......L.LhL........',
        '......LhLhhhL.......',
        '.....LhhhhhhhL......',
        '....Lhhhhhhhhh......',
        '....hhhhhhhhhhh.....',
        '...Hhhhhhhhhhhh.....',
        '...Hhhhhhhhhhhhh....',
        '...HHhhhhhhhhhhh....',
        '....HHhhhhh.hhh.....',
        '.....Hhhh....h......',
        '......Hh............',
        '......H.............'
    ]),
    front: symmetric([
        '..........L',
        '........L.h',
        '.......Lh.h',
        '......Lhhhh',
        '.....Lhhhhh',
        '....Lhhhhhh',
        '....hhhhhhh',
        '...Hhhhhhhh',
        '...Hhhh.hhh',
        '....hh...hh',
        '....h.....h'
    ])
};

const GOHAN = {
    side: side([
        '....................',
        '...........L........',
        '......L...Lh..L.....',
        '.....Lh..Lhh.Lh.....',
        '..L.Lhh.Lhhh.hh.....',
        '..hhhhhhhhhhhhhh....',
        '.HHhhhhhhhhhhhhhh...',
        '..HHhhhhhhhhhhhhh...',
        '...Hhhhhhhhhhhhhhh..',
        '....Hhhhhhh..hhh....',
        '.....Hhhh.....h.....',
        '......Hh............'
    ]),
    front: symmetric([
        '...........',
        '.........L.',
        '....L...Lh.',
        '...Lh..Lhh.',
        '..Lhh.Lhhh.',
        '..hhhhhhhhh',
        '.Hhhhhhhhhh',
        '..hhhhhhhhh',
        '..hhhhhhhhh',
        '..hhh..hhh.',
        '..hh.......'
    ])
};

const GOHAN_SSJ = {
    side: side([
        '.....L.....L........',
        '.....hL...Lh...L....',
        '..L..hh..Lhh..Lh....',
        '..hL.hhh.hhh.Lhh....',
        '...hhhhhhhhhhhhh....',
        '..hhhhhhhhhhhhhhh...',
        '.HhhhhhhhhhhhhhhhH..',
        '..HhhhhhhhhhhhhhhhH.',
        '...Hhhhhhhhhhhhhhh..',
        '....HHhhhhh..hhh....',
        '.....HHhh.....h.....',
        '......Hh............'
    ]),
    front: symmetric([
        '.....L.....',
        '.....hL..L.',
        '..L..hh..hL',
        '..hL.hhh.hh',
        '..hhhhhhhhh',
        '.Hhhhhhhhhh',
        '.Hhhhhhhhhh',
        '..hhhhhhhhh',
        '..hhhhhhhhh',
        '..hhh..hhh.',
        '..hh.......'
    ])
};

// Smooth hair with a parting in the middle, down to the ears.
const TRUNKS = {
    side: side([
        '....................',
        '....................',
        '....................',
        '....................',
        '.......LLLLL........',
        '.....LLhhhhhLL......',
        '....Lhhhhhhhhhh.....',
        '...Lhhhhhhhhhhhh....',
        '...hhhhhhhhhhhhhh...',
        '...hhhhhhhhhhhhhh...',
        '...hhhhhhhh..hhh....',
        '...Hhhhhhh..........',
        '....Hhhhhh..........',
        '....HHhhh...........',
        '.....HHh............'
    ]),
    front: symmetric([
        '...........',
        '...........',
        '...........',
        '...........',
        '......LLLLL',
        '....LLhhhhh',
        '...Lhhhhhhh',
        '..Lhhhhhhhh',
        '..hhhhhhhh.',
        '..hhhhhh...',
        '..hhhh.....',
        '..hhh......',
        '..hhh......',
        '..Hhh......',
        '...HH......'
    ])
};

// Long hair of C-18, down to the chin.
const BOB = {
    side: side([
        '....................',
        '....................',
        '....................',
        '....................',
        '.......LLLLL........',
        '.....LLhhhhhLL......',
        '....Lhhhhhhhhhh.....',
        '...Lhhhhhhhhhhhh....',
        '...hhhhhhhhhhhhhh...',
        '...hhhhhhhhhhhhhh...',
        '...hhhhhhhh..hhhh...',
        '...hhhhhhh..........',
        '...hhhhhhh..........',
        '...hhhhhhh..........',
        '...Hhhhhhh..........',
        '....Hhhhhh..........',
        '....HHhhh...........',
        '.....HHh............'
    ]),
    front: symmetric([
        '...........',
        '...........',
        '...........',
        '...........',
        '......LLLLL',
        '....LLhhhhh',
        '...Lhhhhhhh',
        '..Lhhhhhhhh',
        '..hhhhhhhhh',
        '..hhhhhhhh.',
        '..hhhhhh...',
        '..hhhh.....',
        '..hhh......',
        '..hhh......',
        '..hhh......',
        '..hhh......',
        '..Hhh......',
        '...HH......'
    ])
};

const TRUNKS_SSJ = {
    side: side([
        '....................',
        '....................',
        '.......L...L........',
        '......Lh..Lh..L.....',
        '.....Lhh.Lhh.Lh.....',
        '....Lhhhhhhhhhhh....',
        '...Lhhhhhhhhhhhhh...',
        '...hhhhhhhhhhhhhhh..',
        '...hhhhhhhhhhhhhh...',
        '...Hhhhhhhh..hhh....',
        '...HHhhhhh....h.....',
        '....HHhhh...........',
        '.....HHh............'
    ]),
    front: symmetric([
        '...........',
        '...........',
        '......L...L',
        '.....Lh..Lh',
        '....Lhh.Lhh',
        '...Lhhhhhhh',
        '..Lhhhhhhhh',
        '..hhhhhhhhh',
        '..hhhhhhhh.',
        '..hhhhh..h.',
        '..hhh......',
        '..Hh.......'
    ])
};

const AFRO = {
    side: side([
        '....................',
        '......LLLL..........',
        '....LLhhhhLL........',
        '...Lhhhhhhhhh.......',
        '..Lhhhhhhhhhhh......',
        '..hhhhhhhhhhhhh.....',
        '.hhhhhhhhhhhhhh.....',
        '.hhhhhhhhhhhhhhh....',
        '.Hhhhhhhhhhhhhh.....',
        '.Hhhhhhhhhhhh.......',
        '..Hhhhhh............',
        '..HHhhh.............',
        '...HHh..............',
        '....................',
        '............hhhh....'
    ]),
    front: symmetric([
        '...........',
        '.......LLLL',
        '.....LLhhhh',
        '....Lhhhhhh',
        '...Lhhhhhhh',
        '..hhhhhhhhh',
        '.hhhhhhhhhh',
        '.hhhhhhhhhh',
        '.Hhhhhh....',
        '.Hhhhh.....',
        '..Hhh......',
        '..Hh.......',
        '...........',
        '...........',
        '........hhh'
    ])
};

// A short crest of hair in the middle of a shaved head (C-16).
const MOHAWK = {
    side: side([
        '....................',
        '....................',
        '.........LLLL.......',
        '........hhhhhh......',
        '........hhhhhhh.....',
        '.........hhhhhh.....',
        '..........hhhh......'
    ]),
    front: symmetric([
        '...........',
        '...........',
        '.........LL',
        '.........hh',
        '.........hh',
        '.........hh',
        '.........hh'
    ])
};

const WHIS = {
    side: side([
        '......LLL...........',
        '.....Lhhhh..........',
        '.....hhhhh..........',
        '.....hhhhh..........',
        '.....hhhhhh.........',
        '.....hhhhhh.........',
        '....hhhhhhhh........',
        '....Hhhhhhhhh.......',
        '....HHhhhhhhhh......',
        '.....HHhhhh..h......',
        '......HHh...........'
    ]),
    front: symmetric([
        '........LLL',
        '.......Lhhh',
        '.......hhhh',
        '.......hhhh',
        '.......hhhh',
        '......hhhhh',
        '.....hhhhhh',
        '....Hhhhhhh',
        '....Hhh....',
        '....hh.....'
    ])
};

// --- Other details of the head ---

const KRILLIN_DOTS = {
    side: side(['', '', '', '', '', '', '', '...........k.k......', '', '...........k.k......']),
    front: symmetric(['', '', '', '', '', '', '', '........k..', '', '........k..'])
};

const THIRD_EYE = {
    side: side(['', '', '', '', '', '', '', '', '.............kk', '.............wp']),
    front: front(['', '', '', '', '', '', '', '', '..........kk', '..........wp'])
};

const SCAR = {
    side: side(['', '', '', '', '', '', '', '', '', '', '', '', '..........k', '.........k.k', '..........k']),
    front: front(['', '', '', '', '', '', '', '', '', '', '', '', '.......k', '......k.k', '.......k'])
};

const TURBAN = {
    side: side([
        '....................',
        '....................',
        '....................',
        '.......aaaaa........',
        '......aqqqqaa.......',
        '.....aqaaaaaaa......',
        '.....aaaaaaabba.....',
        '.....aaaaaaaaaaa....',
        '.....AaaaaaaaaaA....',
        '.....AAAAAAAAAA.....',
        '...s................',
        '..sss...............',
        '....ss..............'
    ], { accent: 'turban', second: 'top' }),
    front: symmetric([
        '...........',
        '...........',
        '...........',
        '.......aaaa',
        '.....aaqqqq',
        '....aqaaaaa',
        '....aaaaaab',
        '....aaaaaaa',
        '....Aaaaaaa',
        '....AAAAAAA',
        '..s........',
        '.ss........',
        '..ss.......',
        '...s.......'
    ], { accent: 'turban', second: 'top' })
};

const CELL_CREST = {
    side: side([
        '......a.............',
        '......aa............',
        '...a..aaa...........',
        '...aa.aaaa..........',
        '....aaaaaaa.........',
        '....aAaaaaaa........',
        '.....AAaaaaaa.......',
        '......AAaaaaa.......',
        '.......AAaa.........',
        '',
        '',
        '',
        '............b.......'
    ], { accent: 'top', second: 'cheek' }),
    front: symmetric([
        '...a.......',
        '...aa......',
        '...aaa.....',
        '....aaa....',
        '....aaaa..a',
        '.....aaaaaa',
        '.....Aaaaaa',
        '......AAaaa',
        '',
        '',
        '',
        '',
        '.......b...'
    ], { accent: 'top', second: 'cheek' })
};

const BUBU_ANTENNA = {
    side: side([
        '....................',
        '....ssss............',
        '...sS..ss...........',
        '...S....ss..........',
        '.........ss.........',
        '..........ss........'
    ]),
    front: front([
        '............sss.....',
        '...........s...s....',
        '...........s........',
        '..........ss........',
        '..........ss........',
        '..........ss........'
    ])
};

const FREEZA_DOME = {
    side: side([
        '',
        '',
        '',
        '',
        '..........qq........',
        '........qqaaa.......',
        '.......qaaaaaa......',
        '......qaaaaaaaa.....',
        '......aaaaaaaaa.....',
        '......Aaaaaaaa......',
        '.......AAA..........'
    ], { accent: 'dome' }),
    front: symmetric([
        '',
        '',
        '',
        '',
        '.........qa',
        '.......qqaa',
        '......qaaaa',
        '.....qaaaaa',
        '.....aaaaaa',
        '.....AAAAAA'
    ], { accent: 'dome' })
};

const CAT_EARS = {
    side: side([
        '......s.............',
        '......ss............',
        '......sbs...........',
        '.....sbbs...........',
        '.....sbbss..........',
        '....ssbbsss.........'
    ], { second: 'ear' }),
    front: symmetric([
        '..s........',
        '..ss.......',
        '..sbs......',
        '..sbbs.....',
        '...sbbs....',
        '...sbbss...',
        '....ssss...'
    ], { second: 'ear' })
};

module.exports = {
    FACE_SIDE,
    FACE_FRONT,
    closeEyes,
    withoutBrows,
    HAIR: {
        goku: GOKU,
        'goku-ssj': GOKU_SSJ,
        'goku-ssj3': GOKU_SSJ3,
        vegeta: VEGETA,
        gohan: GOHAN,
        'gohan-ssj': GOHAN_SSJ,
        trunks: TRUNKS,
        'trunks-ssj': TRUNKS_SSJ,
        bob: BOB,
        afro: AFRO,
        mohawk: MOHAWK,
        whis: WHIS,
        'krillin-dots': KRILLIN_DOTS,
        'third-eye': THIRD_EYE,
        scar: SCAR,
        turban: TURBAN,
        'cell-crest': CELL_CREST,
        'bubu-antenna': BUBU_ANTENNA,
        'freeza-dome': FREEZA_DOME,
        'cat-ears': CAT_EARS
    }
};
