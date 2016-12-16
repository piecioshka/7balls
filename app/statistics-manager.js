/**
 * @typedef {Function} ga
 * @description Google Analytics function form {@link `http://www.google-analytics.com/analytics.js`}.
 */

// W przypadku, kiedy nie istnieje globalna funkcja tworzona w Google Analytics
if (typeof ga !== 'function') {
    window.ga = (...args) => {
        args.unshift('[Google Analytics]');
        // console.warn.apply(console, args);
    }
}

export class StatisticsManager {
    game = null;

    constructor(game) {
        this.game = game;
    }

    start() {
        this.game.on('player:choose', ({ character }) => {
            ga('send', 'event', 'game', `choose-${character.id}`);
        });

        this.game.on('locale:select', ({ locale }) => {
            ga('send', 'event', 'game', locale);
        });

        this.game.on('game:over', () => {
            ga('send', 'event', 'game', 'over');
        });

        this.game.on('game:over:try-again', () => {
            ga('send', 'event', 'game', 'try-again');
        });

        this.game.on('game:win', () => {
            ga('send', 'event', 'game', 'win');
        });

        this.game.on('game:win:try-again', () => {
            ga('send', 'event', 'game', 'win-try-again');
        });
    }
}
