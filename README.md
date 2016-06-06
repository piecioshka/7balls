# www.7balls.game

> Projekt ma na celu stworzenie gry internetowej dla fanów anime Dragon Ball.

## TODO

### Błędy

* [ ] dodać tryb `fullscreen`
* [ ] dodać odznakę - link do GitHuba
* [ ] zweryfikować czy `player.x` a nie `player.body.x`? tak samo z `velocity`
* [ ] po co czyścić `velocity` w każdym `update`?
* [ ] zmiana nazw plików wg `snake case`
* [ ] dodać paczkę `debug`
* [ ] jak wyłączyć `Phaser banner`?
* [ ] upgrade `Babel.js`
* [ ] przenieść `DefinitionTypes` do katalogu z dokumentacją
* [ ] nie działa na IE9, bo nie ma `Object.assign` - poprawić
* [ ] przenieść ładowanie assetów do state-a Preload
* [ ] kucanie powinno być na stałe (nie trzeba tak jak przy uderzeniu wracać do normalnej postaci)
* [ ] kucanie nie powinno uderzać zawodnika (rozszerzać bounding boxa)
* [ ] poprawić dodanie customowej czcionki
* [ ] czy faktycznie musimy definiować klawisze jako properties klasy?
* [ ] nie używać fonta `Sayian sans` do wszystkiego, tylko do napisu DBP
* [ ] zamiana `undefined` na `null`
* [ ] `availability` -> `capabilities`
* [ ] przenieść `vendor` do `node_modules` (jest tylko phaser.js)

### Rozwój

* [ ] dodać faktyczny `konami code` - na GitHubie polubiłem odpowiednią bibliotekę
* [ ] czy trzeba tworzyć nowy zegar? czy nie można skorzystać z już istniejącego dodając tylko do `this.time.events.add`?
* [ ] wykorzystajmy `webpack dev server`, aby nie czekać na zmiany
* [ ] zaktualizować grę zgodnie z 24 epizodem (fabuła)
* [ ] dodać `credits` - autorzy gry

### Inne związane z realizacją projektu

* [x] pełny opis (notatki z okresu tworzenia 1 sezonu) - plik STORY.md
* [ ] nauka Phaser.js z 5 zakupionych książek
    * [ ] jaka jest różnica między innymi fizykami gry?
* [ ] kupić `ScreenFlow`

## Fabuła

### Obecna

* na początku gry gracz wybiera postać: Vegeta albo Son Goku
* gracz musi zebrać 7 smoczych kól, aby wyjść ze świata zmarłych do żywych, 
    * gdy to mu się uda, pokazuje mu się smok, który spełnia życzenie zawodnika (na początku będzie to życie), 
    następnie zmierza do walki z pierwszym wojownikiem,
    * gdy mu się nie uda - GAME OVER
* gracz walczy z pierwszym rywalem
    * gdy przegra - nie może walczyć dalej, music zebrać kolejne smocze kule, aby zdobyć życie
    * gdy pokona rywala:
        * dodatkowy exp
        * przenosi się do kuchni własnego domu, aby się najeść i odpocząć
        * następnie przechodzi do salki, gdzie może zdobyć trochę exp (lepszym rozwojem jest walka z przeciwnikiem)
        * po kilku sekundach treningu walczymy z kolejnym rywalem
        

### Planowana

* jeśli gracz wykona dziwny atak dostaje magiczną fasolkę, która może użyć podczas walki
* jeśli długo się nie gra zawodnikiem to jest głodny, bo się go nie nakarmiło
* podczas treningu można wybrać 2 opcje:
    * gracz dalej może walczyć z kolejnym rywalem,
    * albo próbować zdobyć smocze kule, wtedy na mapie pojawiają się przeciwnicy chroniący smoczych kul
* co jakiś czas organizowany jest Turniej Sztuk Walki (Tenka-ichi_Budōkai) na wyspie Papaya
* cała gra jest po polsku, ale możliwa jest wybór języka w dowolnym momencie gry, dostępne są języki:
    * angielski
    * polski

#### Pierwsze pomysły
 
* przechodzenie misji, takie które były w każdej serii
    * walka z Raditz na Ziemi
    * walka z Vegetą na Ziemi
    * walka z Frezerem na Namek
    * walka z Komórczakiem na Ziemi
    * walka z Bubu na Ziemi
* każda część anime to oddzielna część gry (DB, DBZ, DBGT)
* w każdej części można poruszać się pomiędzy światami
    * ziemia:
    * dom Son Goku
    * wyspa Genialnego Żółwia: Kame House
    * dom Capsule Corp.
    * Wieża Karin
    * Pałac Wszechmogącego (Kamiego, Dendiego)
    * zaświaty:
    * droga węża
    * piekło
    * planety:
    * Namek
    * Północnego Kaiō
    * Vegeta
* gracz może latać na planszy, aby dostawać się do konkretnego miejsca
* wraz ze doświadczeniem możliwa jest transformacja wg skali SSJ

## Cechy charakteryzujące zawodnika

* `nickname` - przykład "piecioshka"
* `id` - np. goku, vegeta (po procesie zamiany na małe litery oraz usuwaniu znaków specjalnych)
* `type` - typ postaci: np. Son Goku, Vegeta
* `up` - liczba żyć
* `hp` - procent zdrowia
* `exp` - liczba umiejętności
* `lvl` - poziom siły 
