v0.0.0
==================

 * Remove TypeScript
 * Create Directory public/ with static files
 * Directory app/ should contains only source files
 * Build bundle in public/dist/
 * Remove usage of `slug` library which have dependencies with 2 MB size
 * Copy file Phaser.js in Node.js no by Webpack
 * Remove `runtime` - each event trigger on game object
 * All files are from `public/assets/`
 * Remove `write-file-webpack-plugin`
 * Remove audio files
 * Split config file
 * Use babel-plugin-transform-object-assign instead of lodash.assign (saved 
 16KB)
 * Remove all static states: meal, presentation enemy & player, shenron
 * Draw a lot of graphic in Pixel Art style
 * Remove Training state
 * Merge Fight & Versus state in single Fight state
 * Add Piccolo as 4-th monster
 * Add meta tags in HTML
 * Support Open Graph
 * Display Phaser banner

v1.2.0 / 2016-07-18
==================

  * Setup project name: 7balls
  * Use write-file-webpack-plugin to write bundle file in webpack-dev-server
  * Use webpack-dev-server
  * Use only null, never undefined
  * Add GitHub Ribbon
  * Add "debug" package which display logs
  * Set label to link
  * Link to STORY.md from README.md
  * Apply snake case convention info file names
  * Upgrade Babel.js to v6.x
  * Disable Phaser banner; Move vendor/phaser to node_modules/phaser
  * Split TODO section in README.md file
  * Clear README.md; Add STORY.md
  * Update 7balls logo
  * My first pixel art
  * Remove any itams related with portal for gamers
  * Add game details
  * Remove ESLint
  * Refactoring README
  * New title: 7balls.game
  * Uncomment disabling Google Analytics
  * Setup changelog

v1.1.0 / 2015-09-26
===================

  * From now I can use this syntax: x += 1 instead of x = x + 1.
  * Change ESLint parser to Babel.js.
  * Add possibility to change ESlint parser to Babel.js.
  * Fixed a lot of ESLint errors. Add Phaser as global variable.
  * Each case in switch..case syntax should be start with indention.
  * Decrease min length of variable name, ex. x & y - positions are single
  letter vars.
  * Update .eslintrc with max of rules for v1.5.1 (2015-09-22).
  * Update ESLint configuration.
  * Enable ESLint.
  * Fixed paths in `.gitignore` file about paths to `node_modules/` and
  `npm-debug.log`.
  * Setup Google Analytics events.

v1.0.0 / 2015-09-11
===================

  * Last fixed before deploy after 10 days.
  * Add music to WinnerState.
  * Business logic implement, but is ready to refactoring.
  * More animation on ShenronState.
  * Randoming maps for collecting dragon balls.
  * Attach Google Analytics.

v0.9.0 / 2015-09-10
===================

  * Clean keyboard service.
  * Stop sound when exit from GameOverState.
  * Add simple shortcut for display new character on SelectPlayerState.
  * Reset player numbers (hp, up, exp, lvl) on GameOverState.
  * Support language choose. Create locale mechanizm. Add two locals: en_EN,
  pl_PL.
  * Apply better artificial intelligence.
  * Enlarge versus status label.
  * Use for all label Saiyans font.
  * Setup configuration for jumping in FightState.
  * Fixed gravity configuration.

v0.8.0 / 2015-09-09
===================

  * Support Artificial Intelligence.
  * Add sound for GameOverState and when clock is coming to close
  in `SearchingState`.
  * Create FightState as generic state only with player on stage. Create
  `TrainingState` which extend FightState.
  * FightState is now VersusState.
  * Create MessageState: generic screen which display only text.

v0.7.0 / 2015-09-08
===================

  * Clear collision on FightState.
  * Support remove HP points from Enemy. If HP=0 display player win. Support
  adding points to player. Recognized overlapping of player and enemy. Display
  try-again button on GameOverState. Add keyshortcut for ENTER in GameOverState
  for repeat the level. Don't create new player if exists old.
  * Create generic method to display welcome message in AbstractState. Display
  welcome message on FightState and TrainingState.
  * Append EXP points to player when try kicking or boxing.
  * Disable EXP bar for enemy.
  * Support mouse over event on SelectPlayerState.
  * Fixed priority of layers on FightState.
  * Update background on SelectPlayerState.

v0.6.0 / 2015-09-07
===================

  * Setup characters bars: HP & EXP. Use Saiyan Sans to each graphics as can.
  * Display avatars of characters on FightState.
  * Create AbstractState which is usesd as master class of all states.
  Implement mute (sound) switcher - globally add icon in right bottom corner.
  * Add labels: HP, EXP and LVL on FightState - use Saiyan Sans.

v0.5.0 / 2015-09-06
===================

  * Different sound of kick and punch for player lvl.
  * Enable modify bounding box when animation required.
  * Add sound effect to ShenronState.
  * Setup FightState. Add sound to SearchState.
  * Remove useless background (on SearchingState is displayed map of tiles).
  * Create models for enemies.
  * Add spritesheets for enemies: Freeza, Cell and Bubu.
  * Add MealState - place where character will be rest.
  * Add a lot of sound effects. Use `scouter.ogg` on SelectPlayerState
  when user choose character.
  * Add files related with Dragon Ball logo.

v0.4.0 / 2015-09-05
===================

  * Support keyboard on SelectPlayerState. Default select Son Goku.
  * Create TrainingState.
  * Support countdown on SearchingState.
  * Refactoring _showWelcomeMessage.
  * Create GameOverState with background.
  * Create ShenronState.
  * Reset margin in <body> - the default browser style.

v0.3.0 / 2015-09-03
===================

  * Enable collision. Enable ES7 Stage 0 in webpack configuration file for
  Babel.js.
  * Add background to FightState.
  * Fixed cards position on SelectPlayerState.
  * Support input keyboard: LEFT, RIGHT, UP, DOWN.
  * Add places for dragon balls.
  * Add 2 new maps for SearchingState.
  * Update map - add 7 tiles with dragon balls. Update spritesheet (add 
  eclipse on one tile - this will be dragon ball).
  * Show welcome message on SearchingState.
  * Add two characters (Goku & Vegeta) to SearchingState.
  * Create spritesheet and map (JSON format). Apply map to game.

v0.2.0 / 2015-09-02
===================

  * Update graphics: add background color to bg-select-player.
  * Create default character properties. Print on SearchingState player
  experience.
  * Use SearchingState. Redirect user to it after choose character.
  Setup common player object - cross states.
  * Create player object after user choose.
  * Rename Player model to Character. Player is object which user
  playing/control.
  * Setup two new states: SearchingState & FightState.
  * Create main models: Vegeta & Goku as child base class Player.
  * Display two card. User can select one.
  * Rename Son Goku to Goku.
  * Display background on SelectPlayerState.
  * Create Configuration module.
  * Create graphics.
  * Define SelectPlayerState. Fixed webpack.config.js.
  * Edit README file.

v0.1.0 / 2015-09-01
===================

  * Setup idea for game in README.md
  * Setup Phaser.js
  * Setup webpack configuration.
  * Initial commit
