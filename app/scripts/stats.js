// W przypadku, kiedy nie istnieje globalna funkcja tworzona w Google Analytics
if (typeof ga !== 'function') {
    window.ga = (...args) => {
        args.unshift('[Google Analytics]');
        // console.warn.apply(console, args);
    }
}

module.exports = {
    setup(game) {
        game.on('all', (...args) => {
            // console.info.apply(console, args);
        });

        game.on('player:choose', ({ character }) => {
            ga('send', 'event', 'game', `choose-${character.id}`);
        });

        game.on('locale:select', ({ locale }) => {
            ga('send', 'event', 'game', locale);
        });

        game.on('game:over', () => {
            ga('send', 'event', 'game', 'over');
        });

        game.on('game:over:try-again', () => {
            ga('send', 'event', 'game', 'try-again');
        });

        game.on('game:win', () => {
            ga('send', 'event', 'game', 'win');
        });

        game.on('game:win:try-again', () => {
            ga('send', 'event', 'game', 'win-try-again');
        });
    }
};
