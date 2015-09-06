# www.dragonballplay.com

> Projekt ma na celu stworzenie gry internetowej oraz portalu dla graczy.

## Gra

### Fabuła

Zasady:

 * na początku gry gracz wybiera postać: Vegeta albo Son Goku
 * gracz musi zebrać 7 smoczych kól, aby wyjść ze świata zmarłych do żywych, 
    * gdy to mu się uda, pokazuje mu się smok, który spełnia życzenie zawodnika (na początku będzie to życie), 
    następnie zmierza do walki z pierwszym wojownikiem,
    * gdy mu się nie uda - GAME OVER
 * gracz walczy z pierwszym rywalem
    * gdy przegra ma jeszcze jedno życie, może walczyć dalej, bądź postarać się zebrać kolejne kule aby zdobyć kolejne życie
    * gdy pokona rywala:
        * dodatkowy exp
        * przenosi się do kuchni własnego domu aby się najeść
        * następnie przechodzi do salki, gdzie może zdobyć trochę exp (lepszym rozwojem jest walka z przeciwnikiem)
        * podczas treningu można wybrać 2 opcje:
            * gracz dalej może walczyć z kolejnym rywalem,
            * albo próbować zdobyć smocze kule, wtedy na mapie pojawiają się przeciwnicy chroniący smoczych kul


 - jeśli gracz wykona dziwny atak dostaje magiczną fasolkę, która może użyć podczas walki
 - jeśli długo się nie gra zawodnikiem to jest głodny, bo się go nie nakarmiło

Cechy charakteryzujące zawodnika:

 - nickname, np. piecioshka
 - id: np. goku, vegeta (po procesie zamiany na małe litery oraz usuwaniu znaków specjalnych)
 - postać: np. Son Goku, Vegeta
 - liczba żyć: up
 - procent zdrowia: hp
 - liczba skillsów (umiejętności): exp
 - liczba leveli (siły): lvl

Dodatkowo:

 - co jakiś czas organizowany jest Turniej Sztuk Walki (Tenka-ichi_Budōkai) na wyspie Papaya
 - cała gra jest po polsku, ale możliwa jest wybór języka w dowolnym momencie gry, dostępne są języki:
    - angielski 
    - polski
    - japoński
    - francuski

Pierwsze pomysły:
 
 - przechodzenie misji, takie które były w każdej serii
    - walka z Raditz na Ziemi
    - walka z Vegetą na Ziemi
    - walka z Frezerem na Namek
    - walka z Komórczakiem na Ziemi
    - walka z Bubu na Ziemi
 - każda część anime to oddzielna część gry (DB, DBZ, DBGT)
 - w każdej części można poruszać się pomiędzy światami
    - ziemia:
        - dom Son Goku
        - wyspa Genialnego Żółwia: Kame House
        - dom Capsule Corp.
        - Wieża Karin
        - Pałac Wszechmogącego (Kamiego, Dendiego)
    - zaświaty:
        - droga węża
        - piekło
    - planety:
        - Namek
        - Północnego Kaiō
        - Vegeta
 - gracz może latać na planszy, aby dostawać się do konkretnego miejsca
 - wraz ze doświadczeniem możliwa jest transformacja wg skali SSJ

### Specyfikacja techniczna

 - Phaser.js: http://phaser.io/download/stable

## Dodatkowo: Portal dla graczy

 - dzięki portalowi pozyskamy zainteresowanych historią `Dragon Ball` użytkowników.
 - dzięki rejestracji będziemy przechowywali login użytkownika, który przyda się w grze.

### Wymagania

 - użytkownik (rejestracja, logowanie, zmiana hasła)
 - wybór ulubionej postaci
 - wybór ulubionego tematu strony

### Specyfikacja techniczna

 - Node Express: http://expressjs.com/

## Dodatkowo

 - Gra: http://www.dragonballplay.com/game
 - Portal: http://www.dragonballplay.com
 - Fanpage: https://www.facebook.com/pages/Dragon-Ball-Play/478514248995327
