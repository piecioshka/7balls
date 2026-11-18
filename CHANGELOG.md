# Changelog

All notable changes to this project, newest version first.

## 2.0.0 - 2026-11-18

- 2026-11-18 - **Breaking:** changed the rules to ten named rounds played one after another: dragon balls, Tyrant Freeza, cloud flight, the androids, Perfect Cell, defending the friend, Majin Bubu, training with Whis, Beerus the Destroyer and the Tournament of Power, where every rival enters the ring one after another. Before every round a screen shows its number, name, goal and controls, and after it a summary; a failed round ends the game and can be tried again with full health. ([`ae10a04`], [`06a74c4`])
- 2026-11-18 - **Breaking:** changed levels to power levels from the story: Son Goku has 3 000 000, Freeza 120 000 000, Beerus 20 000 000 000. Experience raises the power of both fighters, and a blow takes twice as much health each time the attacker is 10 times stronger. ([`31781f2`])
- 2026-11-18 - Added Saiyan forms and Kaioken: `S` goes through Super Saiyan (power x20), Super Saiyan 2 (x40), Super Saiyan 3 (x160), Super Saiyan God (x400) and Super Saiyan Blue (x1000), as far as a character can go; `K` starts Kaioken (x10, a big red glow). Forms make blows stronger, take health every second and end by themselves at 10 HP; the avatar in the bar of a fight shows the form in use. ([`31781f2`], [`878be53`])
- 2026-11-18 - Added ten fighters to choose from, in a grid: Son Goku, Vegeta, Gohan, Goten, Trunks, Piccolo, Krillin, Yamcha, Tien and Mr. Satan; and the rivals Freeza, the androids C-17, C-18 and C-16, Cell, Bubu, Beerus and Whis, each fought in their own place. ([`31781f2`])
- 2026-11-18 - Added an energy wave (`V`), a jump and a dodge (`↓`) in fights, also used by the rivals; the rivals gain experience too, and the defeated fighter lies on the ground inside the screen. ([`06a74c4`], [`31781f2`])
- 2026-11-18 - Added ten mazes in the dark for the dragon balls, 20 seconds to collect them, and seven dim balls with 1 to 7 stars in the corner, which light up when found. The player walks through the maze as a small head. ([`06a74c4`], [`878be53`])
- 2026-11-18 - Added the flight on Kinto-un between the fights, with the energy wave against flying Cell Jr., defending a wounded friend from Cell Jr. (forms and Kaioken make blows stronger also there) and the training with Whis. ([`06a74c4`])
- 2026-11-18 - Changed all graphics to pixel art drawn by generators in one pixel size, 5x5 screen pixels, as in version 1.3.4: characters in the style of Son Goku and Vegeta drawn by hand in that version (a black outline, a big head with a lot of hair, heads drawn pixel by pixel, frames looking both ways, own heights), landscapes, final screens, tiles, dragon balls, clouds, waves, an explosion, bars and a rougher 7B logo. ([`878be53`])
- 2026-11-18 - Added a start screen, a controls screen confirmed with `Enter`, and a loading screen where Son Goku shouts "KA-ME-HA-ME-HAAAAA!" and his wave blows up a boulder; the version is displayed only there. ([`ae10a04`])
- 2026-11-18 - Changed every text to one pixel font, Press Start 2P, in one size, and the choice of the language to its name ("English", "Polski") instead of a flag; all texts follow the selected language. ([`e33eb3c`], [`ae10a04`])
- 2026-11-18 - Added music generated in the browser, a dark track for the menus and for every round, with three volume modes (`M`), and sounds of menus, blows, hits, jumps, the energy wave and the explosion. ([`e33eb3c`], [`ae10a04`])
- 2026-11-18 - Added the help with all keyboard shortcuts under `?`, a restart under `R` with a confirmation, both drawn inside the game, fullscreen under `F`, and buttons of the fullscreen and the music in the corner. ([`e33eb3c`])
- 2026-11-18 - Changed the credits: the whole cast flies in and lines up in two rows, with Son Goku in the middle of the front. ([`ae10a04`])
- 2026-11-18 - Added the Konami code (`↑ ↑ ↓ ↓ ← → ← →` `B` `A`): during a fight it turns a Saiyan into a Super Saiyan, elsewhere it turns every place of the game into Namek. ([`e33eb3c`])
- 2026-11-18 - Changed the game to stay quiet in the browser console: states and events are logged only with `?debug` in the address. ([`e33eb3c`])
- 2026-11-18 - Fixed blows of the rival, which almost never hit, mashing which repeated blows, ENTER held on one screen skipping the next one, texts covering each other, enemies drawn as gray blocks and the broken "Fork me on GitHub" ribbon. ([`06a74c4`], [`ae10a04`], [`e33eb3c`])
- 2026-11-18 - Added a favicon, an Apple touch icon and an Open Graph image drawn from the art of the game by `scripts/draw-og-image.js`. ([`878be53`], [`5bc333e`])
- 2026-11-18 - Changed the build to produce a complete, deployable game in a top-level `dist/` directory on current Node.js versions (`npm run build` failed with an OpenSSL error), added `npm run dev`, which serves the game and rebuilds it on every change, and `npm run deploy` publishes `dist/`. ([`fa811b3`])
- 2026-11-18 - Changed the documentation: `README.md` describes the game (features, rounds, controls, screenshots), technical notes and the rules of the art are in the new `CONTRIBUTING.md`, and `docs/` got an index. The license year is 2015, the year the project started. ([`8622e9b`])
- 2026-11-17 - Added the Open Graph and Twitter meta tags, so links to the game get a preview card. ([`f2645f7`])
- 2026-06-25 - Changed the license link in `README.md` to use `https://`. ([#22], [`9d9b500`])
- 2026-06-20 - Added the MIT `LICENSE` file. ([#21], [`f84adfc`])
- 2026-06-19 - Added `.nvmrc` pointing at the current Node.js LTS. ([#20], [`d44c926`])
- 2024-01-23 - Removed Google Analytics from the game page. ([`638d154`])
- 2019-07-27 - Changed dependencies to their current versions. ([`703f111`], [`c222d02`])

## 1.3.4 - 2019-05-02

- 2019-05-02 - Added the missing `cross-env`, used by `npm run deploy`. ([`b639e78`])

## 1.3.3 - 2019-05-02

- 2019-05-02 - Changed dependencies to their current versions. ([`222fb33`])
- 2018-12-03 - Changed the game graphics to losslessly optimized files, which makes the game load faster. ([#5], [`9841b32`])

## 1.3.2 - 2018-07-25

- 2018-07-25 - Changed the project layout: `app/`, `public/` and `tasks/` moved into `src/`, and the build was upgraded to Webpack 4. ([`fd67217`], [`446e647`], [`bf0f69e`])
- 2018-05-21 - Added `npm run deploy`, which publishes the game to GitHub Pages, and updated the link to the playable version. ([`88b6fb3`], [`796bf94`])
- 2018-05-21 - Removed the leftover TypeScript typings. ([`6385c78`])
- 2017-03-29 - Fixed the build after the Webpack 2 upgrade, which requires absolute paths in its configuration, and enabled source maps. ([`aee4dab`], [`fe555af`])
- 2016-12-22 - Added a standing Vegeta sprite and changed the color of the "try again" hint. ([`e309d52`], [`897a123`])

## 1.3.1 - 2016-12-19

- 2016-12-19 - Added the complete Son Goku fight spritesheet: standing, punching, kicking, winning and losing. Sitting and the jump animation were removed. ([`e897def`], [`e8629b7`], [`af1e2ad`], [`f0318c0`])
- 2016-12-19 - Removed the old, unused graphics. ([`125287f`], [`54eccb1`])

## 1.3.0 - 2016-12-18

- 2016-12-18 - Added a credits screen shown after winning the game. ([`f27e85a`])
- 2016-12-18 - Changed most of the graphics to hand-drawn pixel art, and fixed the path to the favicon. ([`d0a4684`], [`0c39a06`], [`fb56715`])
- 2016-12-17 - Added a particle effect when a dragon ball is collected. ([`95f2a4a`])
- 2016-12-16 - **Breaking:** changed the game flow and trimmed it down. The meal, training, Shenron and character presentation screens were removed, the fight and versus screens were merged into one, Piccolo became the fourth enemy, and all sound was removed. Static files moved to `public/` and the bundle is built into `public/dist/`. ([#3], [`42af1c2`], [`3474172`], [`9229809`], [`26c9d13`])
- 2016-09-25 - Added a new screen, `AvoidMonstersState`, as a starting point for a level where the player dodges monsters. ([`d3f418e`])
- 2016-09-25 - Fixed errors on the language screen: a language could be selected more than once, and mashing keys crashed the game. ([`e06c130`], [`3ead2f4`], [`4b5c44a`])
- 2016-09-24 - Changed how screens are wired together: a single `StateManager` now registers all states and controls the transitions between them. ([`0db0ca4`], [`6cea9f3`])
- 2016-09-23 - Added `.babelrc` and experimental TypeScript support _(TypeScript was removed again in December 2016)_. ([`943b8d1`], [`ae08027`])
- 2016-08-16 - Changed several graphics to ones drawn in Aseprite and shortened how long on-screen messages stay visible. ([`6ce6fc9`], [`199c7e0`], [`8046c72`])
- 2016-08-15 - Added character orientation in fights: fighters face each other, with hitboxes matching the side they stand on. ([`81d1864`])
- 2016-08-15 - Fixed the end of a fight: characters now stop moving when the battle is over, including when it ends in mid-air. ([`df01290`], [`29f6c0f`], [`92aaacb`])
- 2016-08-14 - Fixed leftover player sprites when the game was started again. ([`aaa2cae`], [`849109e`])
- 2016-08-06 - Added `npm run count`, which counts the lines of code. ([`4499ee6`])
- 2016-08-02 - Added a progress bar shown while the game assets are loading. ([`90d21e5`], [`748d6d8`], [#2])

## 1.2.0 - 2016-07-18

- 2016-07-18 - Changed the game for its first stable release: Phaser is installed from npm instead of being vendored, Babel was upgraded to v6, files follow one naming convention, ESLint was removed, and the story moved from `README.md` to its own document. ([#1], [`43db2e2`], [`091e1e6`])
- 2016-05-29 - Renamed the game to "7balls". ([`f7fa820`])
- 2015-12-14 - Added `CHANGELOG.md`. ([`4c12e19`])

## 1.1.0 - 2015-09-26

- 2015-09-25 - Added ESLint with the Babel parser and fixed the reported problems. ([`7ca174a`], [`76cd151`], [`5f464e0`], [`0cf33f7`], [`07f5db6`])
- 2015-09-15 - Added Google Analytics with game events. ([`29e88d1`], [`68720ee`])

## 1.0.0 - 2015-09-11

- 2015-09-11 - Added random selection of the map used for collecting dragon balls, more animation on the Shenron screen and music on the winner screen. This closed the 10 days of development. ([`460409f`], [`9cdaac9`], [`1da80fd`], [`f3be997`], [`dff5cd6`])
- 2015-09-10 - Added language selection with two locales, `en_EN` and `pl_PL`. ([`fc4085b`])
- 2015-09-10 - Added a keyboard shortcut on the character screen that reveals an extra character, Piccolo. ([`f4a090e`])
- 2015-09-10 - Fixed the game over screen: player statistics (HP, lives, EXP, level) are reset and the music stops when leaving it. ([`29b706e`], [`c388c3c`])
- 2015-09-09 - Added a computer-controlled enemy that moves and attacks on its own, and jumping in fights. ([`730f72e`], [`fcaa3ec`], [`4870716`], [`7b22a92`])
- 2015-09-09 - Added sounds for the game over screen and for the last seconds of the countdown, and changed all labels to the Saiyan Sans font. ([`07aa3b3`], [`7cec495`], [`56fc0ff`])
- 2015-09-08 - Added the fight rules: blows take HP from the enemy and give EXP to the player, the fight ends when HP reaches zero, and the game over screen has a "try again" button _(also under `Enter`)_. ([`ec6212b`], [`e2afa64`], [`027e7e2`])
- 2015-09-08 - Added a generic text-only screen used for messages between levels, and split fighting into a training screen and a versus screen. ([`3b154f7`], [`954b1dd`], [`063f5b4`])
- 2015-09-07 - Added HP and EXP bars, level labels and character avatars to the fight screen, plus a global mute switch. ([`de7c535`], [`fe02725`], [`bb82675`], [`1859b6b`], [`2c1934b`], [`4068277`])
- 2015-09-07 - Added mouse hover support and a new background on the character screen. ([`d66b987`], [`cd80036`])
- 2015-09-05 - Added the fight screen with punches and kicks, hitboxes that grow during a blow, and different hit sounds depending on the player's level. ([`3648aa8`], [`40d3306`], [`166ff43`])
- 2015-09-05 - Added enemies: Freeza, Cell and Bubu, with their models and placeholder spritesheets. ([`8ee5447`], [`c046fe5`])
- 2015-09-05 - Added sound effects, the meal screen and the training screen. ([`7ee0077`], [`ce60e01`], [`29fb748`], [`bf12d53`])
- 2015-09-05 - Added keyboard support on the character screen _(Son Goku is selected by default)_ and a countdown while collecting dragon balls. ([`a2a9e77`], [`636d0fa`])
- 2015-09-04 - Added the Shenron screen and the game over screen. ([`5731339`], [`01eebbb`])
- 2015-09-03 - Added the dragon ball level: three tile maps, seven dragon balls to collect, arrow key movement and collisions with walls. ([`81a25c6`], [`dec6163`], [`b61918e`], [`220ef03`], [`ac9f18c`], [`c87d85c`], [`900443e`])
- 2015-09-02 - Added the character screen with two cards to choose from, Son Goku and Vegeta, and a player object shared between screens. ([`629be78`], [`ac3bc6c`], [`385e098`], [`ae47e1b`], [`eaa2c7f`], [`efd2688`])
- 2015-09-01 - Added the project skeleton: Webpack, Babel and Phaser. ([`acce99d`], [`3df338d`], [`e7c1802`])

[#1]: https://github.com/piecioshka/7balls/pull/1
[#2]: https://github.com/piecioshka/7balls/pull/2
[#3]: https://github.com/piecioshka/7balls/pull/3
[#5]: https://github.com/piecioshka/7balls/pull/5
[#20]: https://github.com/piecioshka/7balls/pull/20
[#21]: https://github.com/piecioshka/7balls/pull/21
[#22]: https://github.com/piecioshka/7balls/pull/22
[`01eebbb`]: https://github.com/piecioshka/7balls/commit/01eebbb0e605968d7146f98646eddb0112e3b1a4
[`027e7e2`]: https://github.com/piecioshka/7balls/commit/027e7e200302a8c3c662c884f5bc29bce1ec2915
[`063f5b4`]: https://github.com/piecioshka/7balls/commit/063f5b4f7294a2d40470e87291958e2093733b69
[`06a74c4`]: https://github.com/piecioshka/7balls/commit/06a74c477ca46d6c374ccf785c3ce65e9d1575e9
[`07aa3b3`]: https://github.com/piecioshka/7balls/commit/07aa3b3f8af522819fabf3a764ffa185f6d67e7c
[`07f5db6`]: https://github.com/piecioshka/7balls/commit/07f5db6f86fc1295abc9566b20f7b73495db774c
[`091e1e6`]: https://github.com/piecioshka/7balls/commit/091e1e6020d947a582b390014c4795df3503e32d
[`0c39a06`]: https://github.com/piecioshka/7balls/commit/0c39a06d615a574ac90583623ddce04734187ff9
[`0cf33f7`]: https://github.com/piecioshka/7balls/commit/0cf33f7f5e9f72043c459a72c5a20a329aa138e0
[`0db0ca4`]: https://github.com/piecioshka/7balls/commit/0db0ca4306a47927513701c5d69b078606f4f87f
[`125287f`]: https://github.com/piecioshka/7balls/commit/125287f72eb81b343416a829311698caf939d0b9
[`166ff43`]: https://github.com/piecioshka/7balls/commit/166ff43617bc1ddf433b6b4b7acc23466755f871
[`1859b6b`]: https://github.com/piecioshka/7balls/commit/1859b6b05bf62c8b2e4b147c6061f0b9c597b523
[`199c7e0`]: https://github.com/piecioshka/7balls/commit/199c7e040d787134e75d0ecad0f2ebbbd6a2b4a5
[`1da80fd`]: https://github.com/piecioshka/7balls/commit/1da80fd4a1e6aa806033891a8c32d0b1bac7213e
[`220ef03`]: https://github.com/piecioshka/7balls/commit/220ef032fa1d34cc0eadac46029128c5fa9b92db
[`222fb33`]: https://github.com/piecioshka/7balls/commit/222fb3328ffa2c8a9969337874aaf49f442dcc37
[`26c9d13`]: https://github.com/piecioshka/7balls/commit/26c9d13feb4995b5d592ca77287c55edeca1dfd1
[`29b706e`]: https://github.com/piecioshka/7balls/commit/29b706e3b536538091585d5309f0bf09ea39ae1c
[`29e88d1`]: https://github.com/piecioshka/7balls/commit/29e88d15950a1be49556125560a5ca302b06de4e
[`29f6c0f`]: https://github.com/piecioshka/7balls/commit/29f6c0f118b520f50f8eaed14d5b83fd172b49fa
[`29fb748`]: https://github.com/piecioshka/7balls/commit/29fb748fa9658e724bc814317431a61d3697fbb3
[`2c1934b`]: https://github.com/piecioshka/7balls/commit/2c1934b7a1c9c528450ccdb84528ff63a813f893
[`31781f2`]: https://github.com/piecioshka/7balls/commit/31781f2be49699e9d192a7ed763d19eff4b63f85
[`3474172`]: https://github.com/piecioshka/7balls/commit/3474172170e2d905f6b50a96568a162aac66efa0
[`3648aa8`]: https://github.com/piecioshka/7balls/commit/3648aa8e1af063bff50d5cd40ba3f5e84276b950
[`385e098`]: https://github.com/piecioshka/7balls/commit/385e098524f5b1ccede6fb4ddaf48416266628b5
[`3b154f7`]: https://github.com/piecioshka/7balls/commit/3b154f7674885284fb27764dba1c93b0a026b01b
[`3df338d`]: https://github.com/piecioshka/7balls/commit/3df338de6bcc250f55239c178bf71074bf8d0266
[`3ead2f4`]: https://github.com/piecioshka/7balls/commit/3ead2f48119b8c80ea7ecd0bc5558fbe579087b1
[`4068277`]: https://github.com/piecioshka/7balls/commit/4068277d3e296c4cf5317f78cf24ca257b1bc07b
[`40d3306`]: https://github.com/piecioshka/7balls/commit/40d3306b2ae40999ea9312a4e0392e4ee637e55b
[`42af1c2`]: https://github.com/piecioshka/7balls/commit/42af1c2748d75a25cde22642bf2cf5518e871095
[`43db2e2`]: https://github.com/piecioshka/7balls/commit/43db2e239e901fa394d6f5405e7c1f892d982f22
[`446e647`]: https://github.com/piecioshka/7balls/commit/446e647ffd75a0afae6a453637d41f2e091dc23f
[`4499ee6`]: https://github.com/piecioshka/7balls/commit/4499ee66749256f113413b33f72999ce699b7bc4
[`460409f`]: https://github.com/piecioshka/7balls/commit/460409f95b104c0099c698c7c59dd9702ef32d34
[`4870716`]: https://github.com/piecioshka/7balls/commit/4870716754ec6d7a261cfa9c38a74f99fe736d37
[`4b5c44a`]: https://github.com/piecioshka/7balls/commit/4b5c44adebe9a081a464e680f7f079385197248f
[`4c12e19`]: https://github.com/piecioshka/7balls/commit/4c12e1964195202d0be0cd2f94659e39464d2ca0
[`54eccb1`]: https://github.com/piecioshka/7balls/commit/54eccb17290c82c68cd7f2bb4617ff38cbd5d48a
[`56fc0ff`]: https://github.com/piecioshka/7balls/commit/56fc0ffefa1e58165e3efbf623d553b5b4391df5
[`5731339`]: https://github.com/piecioshka/7balls/commit/5731339eac7b260b716d3d4adecdd9c97d900299
[`5bc333e`]: https://github.com/piecioshka/7balls/commit/5bc333e8339b292f2686e66ce9f6a266d6a9d2a2
[`5f464e0`]: https://github.com/piecioshka/7balls/commit/5f464e028a22a80cde8515a43b358b0b243027e4
[`629be78`]: https://github.com/piecioshka/7balls/commit/629be78cc61ed615ca2e0c2ac0748f264f8dcfe9
[`636d0fa`]: https://github.com/piecioshka/7balls/commit/636d0fa773aa37ab00afc3a2d38bc794ceb99371
[`6385c78`]: https://github.com/piecioshka/7balls/commit/6385c78b2796a74ff03a3d9492eb4e5e921ca801
[`638d154`]: https://github.com/piecioshka/7balls/commit/638d1544d34d1b8903fdbd52802bc6bb5faf9b0d
[`68720ee`]: https://github.com/piecioshka/7balls/commit/68720ee4cde04ff480ddb2d30b65a5b491d5adb6
[`6ce6fc9`]: https://github.com/piecioshka/7balls/commit/6ce6fc94a37d16b6c453dcd2ec23c5303fd99047
[`6cea9f3`]: https://github.com/piecioshka/7balls/commit/6cea9f39820341b77630ac2af73d760465d2415f
[`703f111`]: https://github.com/piecioshka/7balls/commit/703f111a6112dca39683d3a8fad0a6e01f2939d2
[`730f72e`]: https://github.com/piecioshka/7balls/commit/730f72ecb7361d3795c318871ab169f35691c192
[`748d6d8`]: https://github.com/piecioshka/7balls/commit/748d6d81ff28f0556c8fec111f6de74b4474df71
[`76cd151`]: https://github.com/piecioshka/7balls/commit/76cd151467731e9729532e9a102c2e52217b5b0f
[`796bf94`]: https://github.com/piecioshka/7balls/commit/796bf947d3d72ceb83254cba3d19f87830c12112
[`7b22a92`]: https://github.com/piecioshka/7balls/commit/7b22a92bf9b6f4902ff022be644f936d9ed6b755
[`7ca174a`]: https://github.com/piecioshka/7balls/commit/7ca174a0b8f3ffd1dec7bb3707f2e634e4c795ec
[`7cec495`]: https://github.com/piecioshka/7balls/commit/7cec4956271d988b5c099b39e7830a97637a9955
[`7ee0077`]: https://github.com/piecioshka/7balls/commit/7ee0077adcf4ccaa7ae8e39aa4d61c0caec01a3c
[`8046c72`]: https://github.com/piecioshka/7balls/commit/8046c72283c3f588790021b0a6bd7cfd1e247867
[`81a25c6`]: https://github.com/piecioshka/7balls/commit/81a25c6555d1bfa6e70d2d655ec8c96e7d93c1e0
[`81d1864`]: https://github.com/piecioshka/7balls/commit/81d1864ea4c1e0737d066c5166b1cf0ce9defb28
[`849109e`]: https://github.com/piecioshka/7balls/commit/849109e3597582ca3fb190bd8c42770b0abeed03
[`8622e9b`]: https://github.com/piecioshka/7balls/commit/8622e9b7723fc2899ee42712c5dae28dd403bcfb
[`878be53`]: https://github.com/piecioshka/7balls/commit/878be53ca1795c578b29d8bc2d8f1fd640679518
[`88b6fb3`]: https://github.com/piecioshka/7balls/commit/88b6fb3e58ad21cc58f8a3a334287ede910bce02
[`897a123`]: https://github.com/piecioshka/7balls/commit/897a1235c698313ad5b50eb23fdca280c99c7ac4
[`8ee5447`]: https://github.com/piecioshka/7balls/commit/8ee54473ac6988d69ba9af8b99a56bb6d0d76f26
[`900443e`]: https://github.com/piecioshka/7balls/commit/900443e1f8378aac828ee7fab3a908f39c4fe3df
[`90d21e5`]: https://github.com/piecioshka/7balls/commit/90d21e544edf04f9278eafe3b0e6da6648d000ea
[`9229809`]: https://github.com/piecioshka/7balls/commit/9229809d88c6e69f875818b8115e4992415ee7dc
[`92aaacb`]: https://github.com/piecioshka/7balls/commit/92aaacb4724970b97cf34a3cbe72e8621768c7d4
[`943b8d1`]: https://github.com/piecioshka/7balls/commit/943b8d1685416594dc8752de78de1bf77f8d5904
[`954b1dd`]: https://github.com/piecioshka/7balls/commit/954b1ddb2d5975446a97b6f5b893258231e2254f
[`95f2a4a`]: https://github.com/piecioshka/7balls/commit/95f2a4a1f0ef27d7d32071e8e8016167815418e8
[`9841b32`]: https://github.com/piecioshka/7balls/commit/9841b32f59aa64be57252d855d2fc5b7c1ceabcf
[`9cdaac9`]: https://github.com/piecioshka/7balls/commit/9cdaac9a965231ca3e45bbdb376320ece352b22e
[`9d9b500`]: https://github.com/piecioshka/7balls/commit/9d9b500a33f7b65445654bb5122f27ab4eca097f
[`a2a9e77`]: https://github.com/piecioshka/7balls/commit/a2a9e77e71d0ecb48fa7b1aa6c7af9395e589a28
[`aaa2cae`]: https://github.com/piecioshka/7balls/commit/aaa2cae4ce98cdb6dd471609c552f126bff1528f
[`ac3bc6c`]: https://github.com/piecioshka/7balls/commit/ac3bc6cfcce3971aff679f53b0e82c1030b65401
[`ac9f18c`]: https://github.com/piecioshka/7balls/commit/ac9f18c44234e2adc330408d8e2d4fc95c767b39
[`acce99d`]: https://github.com/piecioshka/7balls/commit/acce99d42b13ba7ea70e90c649fe26b0d72e2956
[`ae08027`]: https://github.com/piecioshka/7balls/commit/ae08027ddaff2bdbc92eebd5c85fea5de0e6e683
[`ae10a04`]: https://github.com/piecioshka/7balls/commit/ae10a041051a4707d90c899a425aed6c342cdfe8
[`ae47e1b`]: https://github.com/piecioshka/7balls/commit/ae47e1b30c007d2992ad97b9318f8aefb92ad2fa
[`aee4dab`]: https://github.com/piecioshka/7balls/commit/aee4dab2cef04869ace7e9a1a8959392fc5ff8ef
[`af1e2ad`]: https://github.com/piecioshka/7balls/commit/af1e2ad283f0f10fc1014032fa7ed554b950faec
[`b61918e`]: https://github.com/piecioshka/7balls/commit/b61918eb6658f4b517c0edf1b7728c7d5b2aa8d2
[`b639e78`]: https://github.com/piecioshka/7balls/commit/b639e78b77eee0fd096227d01c5bfc4f47643f29
[`bb82675`]: https://github.com/piecioshka/7balls/commit/bb82675449315827182c37817d750b8be57e18c2
[`bf0f69e`]: https://github.com/piecioshka/7balls/commit/bf0f69e91e583dc7bb3b268771cea5b03f69ef34
[`bf12d53`]: https://github.com/piecioshka/7balls/commit/bf12d53d01ec0c89bfe809432b72a3eb1fa9cc29
[`c046fe5`]: https://github.com/piecioshka/7balls/commit/c046fe55dba976e5acf45922a8e1b74a5374b5d4
[`c222d02`]: https://github.com/piecioshka/7balls/commit/c222d02be6d713edf817c521a7de98547b719e7c
[`c388c3c`]: https://github.com/piecioshka/7balls/commit/c388c3ccdc8fdefbf6eb3b2e6ede349c6a641f8e
[`c87d85c`]: https://github.com/piecioshka/7balls/commit/c87d85c1006f9b0389a1e413be6269d8d79fde8f
[`cd80036`]: https://github.com/piecioshka/7balls/commit/cd80036fb5ac984a3e854aa7d0cec75240d3dbe2
[`ce60e01`]: https://github.com/piecioshka/7balls/commit/ce60e017107d20e14c325099ed1d568f8e9e8166
[`d0a4684`]: https://github.com/piecioshka/7balls/commit/d0a468444467be04fb57ebe034434aa137e1222e
[`d3f418e`]: https://github.com/piecioshka/7balls/commit/d3f418e474a8e5a74a7300cec8bc32a63aae8657
[`d44c926`]: https://github.com/piecioshka/7balls/commit/d44c9268e9b5bb2f34f534612d3a82abb8f92062
[`d66b987`]: https://github.com/piecioshka/7balls/commit/d66b98735e73d136af1ec1233afe56b4512ab4d6
[`de7c535`]: https://github.com/piecioshka/7balls/commit/de7c53565407b03a68179f5c03417520f57d64db
[`dec6163`]: https://github.com/piecioshka/7balls/commit/dec6163bf1f0b697f5ff374435048a7baa23d1e6
[`df01290`]: https://github.com/piecioshka/7balls/commit/df012904ac49cfcd5fd33024c7311efd7b509f6e
[`dff5cd6`]: https://github.com/piecioshka/7balls/commit/dff5cd6a9828f33a9aad0f63725465bf22f25ad5
[`e06c130`]: https://github.com/piecioshka/7balls/commit/e06c130e1cdf2672ce5b481d630f46322431e07d
[`e2afa64`]: https://github.com/piecioshka/7balls/commit/e2afa64abef231ff2cc8353d46a898db3eb99979
[`e309d52`]: https://github.com/piecioshka/7balls/commit/e309d528ec1f8b1faa6db7c3193515842270929a
[`e33eb3c`]: https://github.com/piecioshka/7balls/commit/e33eb3c1a6d69837c67a0dfd6f7b25fd173c966a
[`e7c1802`]: https://github.com/piecioshka/7balls/commit/e7c180240dc33c3e698eb4b77845f3106e509b85
[`e8629b7`]: https://github.com/piecioshka/7balls/commit/e8629b744b00712f390d3b99d749ed49b6a11871
[`e897def`]: https://github.com/piecioshka/7balls/commit/e897def7b97560d945ffe9a69b55ec4b78808e0a
[`eaa2c7f`]: https://github.com/piecioshka/7balls/commit/eaa2c7f267888498a9cba24abae449bec05508b8
[`ec6212b`]: https://github.com/piecioshka/7balls/commit/ec6212baeb61dcb2ff0b81dd391f44942e44ef87
[`efd2688`]: https://github.com/piecioshka/7balls/commit/efd2688ac231ec2f4049af14609e03ee5d96d364
[`f0318c0`]: https://github.com/piecioshka/7balls/commit/f0318c0f1ae7c2c53592070610ad59e9fff4fdc0
[`f2645f7`]: https://github.com/piecioshka/7balls/commit/f2645f7bb8dc3de7d6be4d5ce9ca26474b74b744
[`f27e85a`]: https://github.com/piecioshka/7balls/commit/f27e85a3d04a9a8f148e267aeaf6e49dbf67f222
[`f3be997`]: https://github.com/piecioshka/7balls/commit/f3be997ac3813b3b500a77a781617df2972b930b
[`f4a090e`]: https://github.com/piecioshka/7balls/commit/f4a090ecfbd0adc638e53ac7609479e26404edae
[`f7fa820`]: https://github.com/piecioshka/7balls/commit/f7fa820485017e78073dfcb0f9c92cbf427b9ff0
[`f84adfc`]: https://github.com/piecioshka/7balls/commit/f84adfc62a9778c46cb1fb90c98d114907b45c77
[`fa811b3`]: https://github.com/piecioshka/7balls/commit/fa811b33ed4b44156c66313e595859c05d5961b1
[`fb56715`]: https://github.com/piecioshka/7balls/commit/fb5671577ca66c57c56d315524c11254a0ff1604
[`fc4085b`]: https://github.com/piecioshka/7balls/commit/fc4085bbda5dd616a7c0838565527141590dcaa4
[`fcaa3ec`]: https://github.com/piecioshka/7balls/commit/fcaa3ecbb4a206bba2ef02a3329f131dbdf96a7f
[`fd67217`]: https://github.com/piecioshka/7balls/commit/fd672171fb6d600d6885c3d224c03c96494dd661
[`fe02725`]: https://github.com/piecioshka/7balls/commit/fe027259ad7a9f5eb3eac5b8abfd76a884a3c385
[`fe555af`]: https://github.com/piecioshka/7balls/commit/fe555afb441a3e59dd9f5fa8789b3e9b532e1bd9
