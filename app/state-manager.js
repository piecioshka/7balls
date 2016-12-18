import BootstrapState from './states/bootstrap-state';
import LoadingState from './states/loading-state';
import CollectDragonBallsState from './states/play-states/collect-dragon-balls-state';
import GameOverState from './states/static-states/game-over-state';
import SelectLanguageState from './states/select-states/select-language-state';
import SelectPlayerState from './states/select-states/select-player-state';
import FightState from './states/play-states/fight-state';
import WinnerState from './states/static-states/winner-state';
import CreditsState from './states/static-states/credits-state';
import AvoidMonstersState from './states/play-states/avoid-monsters-state';

export class StateManager {
    game = null;

    constructor(game) {
        this.game = game;
        this.setupStates();
        this.setupNativeListeners();
        this.setupListeners();
    }

    setupStates() {
        this.game.state.add('Bootstrap', BootstrapState);
        this.game.state.add('Loading', LoadingState);
        this.game.state.add('SelectLanguage', SelectLanguageState);
        this.game.state.add('SelectPlayer', SelectPlayerState);
        this.game.state.add('CollectDragonBalls', CollectDragonBallsState);
        this.game.state.add('AvoidMonsters', AvoidMonstersState);
        this.game.state.add('Fight', FightState);
        this.game.state.add('Winner', WinnerState);
        this.game.state.add('GameOver', GameOverState);
        this.game.state.add('Credits', CreditsState);
    }

    setupNativeListeners() {
        this.game.state.onStateChange.add((newState, oldState) => {
            console.debug('[SM] State: %s', newState);
        });
    }

    setupListeners() {
        this.game.on('all', (...args) => {
            args.unshift('%c[SM] Event:', 'color: green');
            console.log.apply(console, args);
        });

        this.game.on('game:bootstrap', () => {
            this.game.state.start('Loading');
        });

        this.game.on('game:loaded', () => {
            this.game.state.start('SelectLanguage');
        });

        let selectPlayer = () => {
            this.game.state.start('SelectPlayer');
        };

        this.game.on('game:language-selected', selectPlayer);
        this.game.on('game:over:try-again', selectPlayer);
        this.game.on('game:win:try-again', selectPlayer);

        this.game.on('player:select', () => {
            // this.game.state.start('AvoidMonsters');
            this.game.state.start('CollectDragonBalls');
        });

        let startFight = () => {
            this.game.state.start('Fight');
        };

        this.game.on('game:collect-failed', startFight);
        this.game.on('game:next-enemy', startFight);

        this.game.on('enemy:killed', () => {
            if (this.game.enemies.length === 0) {
                this.game.emit('game:win');
            } else {
                this.game.emit('game:next-enemy');
            }
        });

        let win = () => {
            this.game.state.start('Winner');
        };

        this.game.on('game:collect-completed', win);
        this.game.on('game:win', win);

        this.game.on('game:credits', () => {
            this.game.state.start('Credits');
        });

        this.game.on('game:over', () => {
            this.game.state.start('GameOver');
        });
    }

    start() {
        this.game.state.start('Bootstrap');
    }
}
