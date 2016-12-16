# Moje 10 dni z `Phaser.js`

Chciałbym w 10 dni zrobić sporo materiału do kilku rzeczy:

* prelekcja na WarsawJS Meetup #13 - 2015-09-16
* stworzyć nagranie z 10 dni w Phaser.js
    * narracja pomiędzy dniami
    * nie udało się odpowiedzieć jak będzie gra wyglądała, bo głowę miałem uciętą, więc trzeba to jutro nagrać (4)
    * warto pokazać kadr z tej sceny
* napisać pracę dyplomową w oparciu o grę napisaną w JavaScript

## Dzień I - 2015-09-01

* nagrać: zapowiedz - o czym będzie projekt (0)
* nagrać: jak się tworzy projekt (1), (2), (3)
    * Konfiguracja webpacka
        * Stworzenie projektu w terminalu
            * trzeba będzie dodać co robi new-project
        * Stworzenie HTML i JS
        * Uruchomienie aplikacji w przeglądarce
        * Stworzenie konfiguracji webpacka
            * trzeba dodać info, że: exclude: ‚node_modules’ -> exclude: /node_modules/
        * Uruchomienie webpacka oraz aplikacji w przeglądarce
    * Publikacja projektu z użyciem GitHuba
        * Stworzenie projektu na GitHub
        * Wypchanie projektu na serwer
    * Instalacja Phaser.js
        * Pobranie Phaser.js
        * Wykorzystanie Phaser.js

## Dzień II - 2015-09-02

* nagrać: jaka jest fabuła gry? (5)
* nagrać: dodajemy nasz pierwszy stan gry oraz poprawiamy bug w webpack.config.js (node_modules) oraz dodajemy resolve.extensions (6)
* develop: wybór gracza
* develop: stworzyć obiekt gracza (zaimplementować jego charakterystykę)
* develop: prosty ekran poszukiwania smoczych kul
* DODATKOWO: nagrać: rozwiązanie współdzielenia obiektu pomiędzy stanami (7)
* DODATKOWO: admin: konfiguracja domeny, aby kierowała na grę.

## Dzień III - 2015-09-03

* develop: ekran walki (początek)
* develop: 3 rodzaje mapy zbierania smoczych kul (łatwa, normalna, trudna)
* design: stworzenie postaci (prosta grafika)
* design: stworzenie smoczych kul (prosta grafika)
* DODATKOWO: nagrać: podsumowanie 2 pierwszych dni (8)
* DODATKOWO: nagrać: tworzenie spritesheet (9)
* DODATKOWO: nagrać: jak tworzy się mapy od zera (grafika, mapka, layer) (10)
* DODATKOWO: nagrać: tworzenie nowych map oraz definicja położenia smoczych kul (11)
* DODATKOWO: nagrać: obsługa strzałek na klawiaturze (12)
* DODATKOWO: nagrać: kolizje (13)
    * włączenie ES7 Stage 0 w webpack.config.js
    * kolizje w Phaser.js nie będą działać, gdy velocity = 0

## Dzień IV - 2015-09-04

* develop: ekran spełnienia życzenia (definicja życzeń) - ShenronState (trochę)
* DODATKOWO: develop: ekran zakończenia gry GameOverState
* develop: czas gry w SearchingState
* DODATKOWO: nagrać: odliczanie czasu (14)
* develop: sala treningowa - TreningState (tylko stworzenie ekranu)
* DODATKOWO: develop: wspierać klawiaturę przy wyborze postaci

## Dzień V - 2015-09-05

* nagrać: tworzenie napisu na papierze „Dragon Ball" za pomocą spraya (15)
* net: ściągnąć oryginalną muzykę z anime
    * https://www.youtube.com/watch?v=jjYc7C8Es_8
    * http://voiceactingalliance.com/board/showthread.php?83158-Dragonball-Sound-FX-Anime-Fighting-SFX-and-more
* develop: stworzyć ekran posiłku w domu (tylko animacja) - MealState
* design: stworzyć spritesheet dla bohaterów w FightState (tylko zaślepki)
* develop: ekran walki
* develop: możliwe ruchy
    * kucanie
    * stanie
    * skok
    * cios ręką
    * uderzenie nogą
* develop: powiększenie hitboxów podczas wykonywania uderzeń
* DODATKOWO: nagrać: dźwięki w grze (16)
* DODATKOWO: nagrać: konfiguracja FightState (17)
* DODATKOWO: nagrać: jak się wspiera modyfikacje bounding-boxa (18)
* DODATKOWO: develop: inny dźwięk uderzenia w zależności od lvl

## Dzień VI - 2015-09-06

* develop: prezentacja hp i exp na FightState
* DODATKOWO: nagrać dodawania tekstu o niestandardowej czcionce (19)
* DODATKOWO: develop: dodać wyciszenie dźwięków (zapisywania do localStorage)
* design: dodać wszędzie gdzie można logo Dragon Ball albo BDP

## Dzień VII - 2015-09-07

* design: dodać Play do background w SelectPlayerState
* develop: zmienić kolejność ładowania pasków, aby były one nieprzysłanialne przez zawodników
* develop: aktywować kartę gracza po najechaniu myszką
* develop: wyszarzyć exp dla wroga
* develop: doliczać punkty exp graczowi za każdy zadany cios we wroga
* DODATKOWO: napis `Fight` na ekranie FightState
* DODATKOWO: napis `Player Win` na ekranie FightState
* DODATKOWO: develop: dodać przycisk `Try again` na ekranie GameOverState
* DODATKOWO: develop: nie tworzymy nowego playera skoro raz jest stworzony
* DODATKOWO: develop: kończymy grę jeśli wróg nie ma hp
* develop: odliczać punkty hp gdy zawodnik (gracz, wróg) dostanie cios
* DODATKOWO: nagrać: Przysłaniania opcji gry (20)

## Dzień VIII - 2015-09-08

* DODATKOWO: develop: generyczny ekran tylko z tekstem
* develop: ekran prezentacji sterowania
* develop: ekran treningu
* develop: muzyka gdy czas się kończy na SearchingState
* develop: muzyka do GameOverState
* develop: dodać automatyczne bicie się przez wroga
* DODATKOWO: nagrać: Ekran tylko z tekstem (21)

## Dzień IX - 2015-09-09

* develop: wyłączyć kolizję z sufitem
* develop: licznik na SearchingState prezentować czcionkę SaiyansSans
* develop: losować zadawane ciosy przez komputer
* DODATKOWO: nagrać jak stworzyć sztuczną inteligencję (22)
* develop: stworzyć plik z lokalizacją
* develop: podczas GameOverState powinno się czyścić liczba leveli
* develop: dodać wsparcie "Konami code” - na ekranie SelectPlayerState pojawia się nowa postać do gry - Piccolo
* DODATKOWO: develop: uszczuplenie obsługi klawiatury

## Dzień X - 2015-09-10

* develop: dodać ekrany zgodnie z fabułą
* nagrać: jak wygląda fabuła gry (narysować na kartce)
* nagrać: podziękować za 10 dni codziennej pracy przy projekcie
* nagrać: gra jest dostępna pod domeną http://www.7balls.game
* DODATKOWO: nagrać: podsumowanie 10 dni (23)
* DODATKOWO: nagrać: fabuła gry (24)
* DODATKOWO: nagrać: zakończenie projektu (25)

## Przyszłość

* develop: blokować zachowanie zawodnika kiedy przegrał
* develop: licznik czasu na treningu
* develop: prezentować wersję gry drobnym druczkiem
* develop: dłuższe prezentowanie tekstów
* develop: blokowanie postaci, aby nie wchodziły na siebie, ani nie przesuwały
* develop: skróty klawiaturowe w walce
* develop: poprawić obsługę "Konami code"
* develop: dodać wsparcie Gamepad API: https://github.com/piecioshka/gamepad.js
* develop: wykorzystać Notification API: https://developer.mozilla.org/en/docs/Web/API/notification
* design: narysować postacie
* design: stworzyć favicon
