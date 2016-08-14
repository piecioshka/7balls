# 7balls

> Gry webowa oparta na anime "Dragon Ball"

## Gdzie można zagrać?

Wspierane są wszystkie najnowsze wersje przeglądarek,
oraz systemy operacyjne: MS Windows, Linux, Mac OS X.
Aplikacja dostępna jest tutaj: http://www.7balls.game

## Geneza projektu

Gra była realizowana na potrzeby stworzenia [prezentacji](https://www.youtube.com/watch?v=klDeljOKDjU) na WarsawJS.
Podczas tworzenia projektu powstało 25 filmów na temat tego projektu.
Wszystkie materiały znajdują się na kanale YouTube autora.
[Playlista](https://www.youtube.com/playlist?list=PLDTdlgCXlVhjAlKJ1W2Y12Xejvt4Ih02p) zawiera
kompletną listę odcinków w chronologicznej postaci.

## Uruchomienie deweloperskie (dla programistów)

```
npm install
npm run dev     # buduje paczkę developerską
npm run build   # buduje paczkę produkcyjną
npm run watch   # obserwuje zmiany w plikach i buduje developerską paczkę
```

## TODO LIST

### Błędy

* [x] wyłączyć `Phaser banner`
* [x] przenieść `vendor` do `node_modules` (jest tylko `phaser.js`)
* [x] upgrade `Babel.js` do wersji 6.x
* [x] zmiana nazw plików wg `snake case`
* [x] dodać paczkę `debug`
* [x] dodać odznakę - link do GitHuba
* [x] zamiana `undefined` na `null`
* [x] nie działa na IE9, bo nie ma `Object.assign` - użyć `lodash.assign`
* [x] poprawić dodanie customowej czcionki
* [x] kucanie nie powinno uderzać zawodnika (rozszerzać bounding boxa)
* [x] nie używać fonta `Sayian sans` do wszystkiego, tylko do napisu DBP
* [x] zatrzymaj postacie po skończonej bitwie
* [x] rywal powinien uderzać w kierunku gracza, a nie w tym samym
* [x] po skończonej walce sprowadzamy postacie na ziemie i odtwarzamy ostatnie animacje (zwycięstwo i porażka)
* [ ] zweryfikować czy `player.x` a nie `player.body.x`? tak samo z `velocity`
* [ ] po co czyścić `velocity` w każdym `update`?
* [ ] kucanie powinno być na stałe (nie trzeba tak jak przy uderzeniu wracać do normalnej postaci)
* [ ] podczas versus, zawodnicy nie mogą na siebie nachodzić

### Rozwój

* [x] wykorzystajmy `webpack-dev-server`, aby nie czekać na zmiany
* [x] przenieść `DefinitionTypes` do katalogu `misc`
* [x] przenieść ładowanie assetów do `BootstrapState`
* [x] prezentować aktualną wersję na ekranach wyboru języka i zawodnika
* [x] stworzyć loader podczas ładowania assetów
* [ ] czy faktycznie musimy definiować klawisze jako properties klasy?
* [ ] dodać tryb `fullscreen`
* [ ] dodać faktyczny `konami code` - na GitHubie polubiłem odpowiednią bibliotekę
* [ ] czy trzeba tworzyć nowy zegar? czy nie można skorzystać z już istniejącego dodając tylko do `this.time.events.add`?
* [ ] zaktualizować grę zgodnie z 24 epizodem (fabuła)
* [ ] dodać `credits` - autorzy gry
* [ ] po porażce przegrany powinien leżeć na ziemi
* [ ] zrezygnować z zarządzaniem przezroczystością na rzecz zielonej otoczki (border)
* [ ] narysować Son Goku, który robi "Kamehameha" i użyć jako loader podczas ładowania gry

### Inne związane z realizacją projektu

* [x] pełny opis (notatki z okresu tworzenia 1 sezonu) - plik `MY-10-DAYS.md`
* [ ] nauka Phaser.js z 5 zakupionych książek
    * [ ] jaka jest różnica między innymi fizykami gry?
* [ ] kupić `ScreenFlow`
* [ ] nagrać jak korzysta się z paczki `debug`
* [ ] nagrać jak się konwertuje projekt z 5.x na 6.x `Babel.js`
* [ ] nagrać jak używać `webpack-dev-server` razem z `write-file-webpack-plugin`

## Kontakt

Kontakt do autora aplikacji:

 * Twitter: [@piecioshka](http://twitter.com/piecioshka)
 * Wykop: [@piecioshka](http://wykop.pl/profile/piecioshka)
 * Blog: [piecioshka.pl](https://piecioshka.pl/blog)

---

@ 2015
