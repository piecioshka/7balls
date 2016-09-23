import runtime from './runtime';

// W przypadku, kiedy nie istnieje globalna funkcja tworzona w Google Analytics
if (typeof ga !== 'function') {
    window.ga = (...args) => {
        args.unshift('[Google Analytics]');
        // console.warn.apply(console, args);
    }
}

module.exports = {
    setup() {
        runtime.on('player:choose', ({ character }) => {
            ga('send', 'event', 'game', `choose-${character.id}`);
        });

        runtime.on('locale:select', ({ locale }) => {
            ga('send', 'event', 'game', locale);
        });

        runtime.on('game:over', () => {
            ga('send', 'event', 'game', 'over');
        });

        runtime.on('game:over:try-again', () => {
            ga('send', 'event', 'game', 'try-again');
        });

        runtime.on('game:win', () => {
            ga('send', 'event', 'game', 'win');
        });

        runtime.on('game:win:try-again', () => {
            ga('send', 'event', 'game', 'win-try-again');
        });
    }
};
