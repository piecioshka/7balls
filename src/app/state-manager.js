import BootstrapState from './states/bootstrap-state';
import LoadingState from './states/loading-state';
import CollectDragonBallsState from './states/play-states/collect-dragon-balls-state';
import GameOverState from './states/static-states/game-over-state';
import SelectLanguageState from './states/select-states/select-language-state';
import SelectPlayerState from './states/select-states/select-player-state';
import FightState from './states/play-states/fight-state';
import WinnerState from './states/static-states/winner-state';
import CreditsState from './states/static-states/credits-state';
import ControlsState from './states/static-states/controls-state';
import RoundIntroState from './states/static-states/round-intro-state';
import RoundSummaryState from './states/static-states/round-summary-state';
import AvoidMonstersState from './states/play-states/avoid-monsters-state';
import DefendFriendState from './states/play-states/defend-friend-state';
import WhisTrainingState from './states/play-states/whis-training-state';

import { GAUNTLETS } from './models/gauntlets';

const ROUNDS = require('./constants/rounds');

const { debug } = require('./helpers/debug');

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
        this.game.state.add('Controls', ControlsState);
        this.game.state.add('SelectPlayer', SelectPlayerState);
        this.game.state.add('CollectDragonBalls', CollectDragonBallsState);
        this.game.state.add('AvoidMonsters', AvoidMonstersState);
        this.game.state.add('RoundIntro', RoundIntroState);
        this.game.state.add('RoundSummary', RoundSummaryState);
        this.game.state.add('Fight', FightState);
        this.game.state.add('DefendFriend', DefendFriendState);
        this.game.state.add('WhisTraining', WhisTrainingState);
        this.game.state.add('Winner', WinnerState);
        this.game.state.add('GameOver', GameOverState);
        this.game.state.add('Credits', CreditsState);
    }

    setupNativeListeners() {
        this.game.state.onStateChange.add((newState) => {
            debug('state:', newState);
        });
    }

    /**
     * Shows the introduction of the current round.
     */
    introduceRound() {
        this.game.state.start('RoundIntro');
    }

    /**
     * A passed round leads to the next one; after the last one the game is won.
     */
    completeRound() {
        this.game.round++;

        if (this.game.round >= ROUNDS.length) {
            this.game.emit('game:win');
        } else {
            this.introduceRound();
        }
    }

    setupListeners() {
        this.game.on('all', (...args) => {
            debug('event:', ...args);
        });

        this.game.on('game:bootstrap', () => {
            this.game.state.start('Loading');
        });

        this.game.on('game:loaded', () => {
            this.game.state.start('SelectLanguage');
        });

        this.game.on('game:language-selected', () => {
            this.game.state.start('Controls');
        });

        let selectPlayer = () => {
            this.game.state.start('SelectPlayer');
        };

        this.game.on('game:controls-confirmed', selectPlayer);
        this.game.on('game:new', selectPlayer);

        this.game.on('player:select', () => {
            this.game.round = 0;
            this.game.startedAt = Date.now();
            this.introduceRound();
        });

        this.game.on('round:confirmed', () => {
            let round = ROUNDS[this.game.round];

            // Several rivals one after another, in place of the next duel.
            this.game.rivals = round.gauntlet ? GAUNTLETS[round.gauntlet].slice() : this.game.enemies;

            // Before the tournament the player is rested.
            if (round.isTournament) {
                this.game.player.resetHP();
            }

            this.game.state.start(round.state);
        });

        // Every round reports its success with its own event, which carries
        // what the player achieved. It is shown in the summary first.
        ['game:collect-completed', 'enemy:killed', 'game:flight-completed', 'game:friend-saved', 'game:training-completed'].forEach((name) => {
            this.game.on(name, (payload) => {
                let gauntlet = ROUNDS[this.game.round].gauntlet;

                if (gauntlet) {
                    if (this.game.rivals.length > 0) {
                        // The next rival comes right away.
                        this.game.state.start('Fight');
                        return;
                    }

                    let count = GAUNTLETS[gauntlet].length;
                    payload = { summary: [{ label: 'rivals', value: `${count} / ${count}` }] };
                }

                this.game.summary = (payload && payload.summary) || [];
                this.game.state.start('RoundSummary');
            });
        });

        this.game.on('round:summary-confirmed', () => this.completeRound());

        // A failed round ends the game...
        ['game:collect-failed', 'game:over'].forEach((name) => {
            this.game.on(name, () => {
                this.game.state.start('GameOver');
            });
        });

        // ...but it can be tried again, with full health.
        this.game.on('game:over:try-again', () => {
            this.game.player.resetHP();
            this.introduceRound();
        });

        // The game starts over, from the choice of the language.
        this.game.on('game:restart', () => {
            this.game.locale = null;
            this.game.isOnNamek = false;
            this.game.state.start('SelectLanguage');
        });

        this.game.on('game:win', () => {
            this.game.state.start('Winner');
        });

        this.game.on('game:credits', () => {
            this.game.state.start('Credits');
        });
    }

    start() {
        this.game.state.start('Bootstrap');
    }
}
