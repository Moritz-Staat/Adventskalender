---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["components"]
---

## Scope
Ganze App (Login, Setup, Dashboard mit Tagesbühne/Gewinnertafel/Topf/Protokoll, Glücksrad-Modal, Upload/Viewer/Einstellungen). Modus: Experience. Handy zuerst (390px), Laptop sekundär.

## Audience & job
Erwachsene Familie, täglich im Dezember, abends auf dem Sofa am Handy: einloggen, auslosen oder die Ziehung sehen, Gewinner lädt Foto hoch.

## Direction contract
THESIS: Die App ist die Losbude der Familie auf dem Weihnachtsmarkt. Ein beleuchtetes Glücksrad mit Glühbirnenkranz ist das Hauptobjekt, Lose von der Rolle tragen die Namen, die 25 Tage sind eine Gewinnertafel. Verweigert: Karten-Dashboard auf Creme mit Tannengrün und Emoji-Deko.

OWN-WORLD: Budennacht (tiefes Rotbraun-Schwarz) als Grund, rot-cremefarben gestreifte Markise mit Bogenkante als große Fläche, warmweiße Glühbirnen (keine Neonfarben), lackierte Schilder mit Schaustellerschrift (Rye), Losnummern und Türchenzahlen in schmaler Plakatgrotesk (Big Shoulders), Lose in Pastellpapier pro Person mit Perforation und Stanzloch. Schnee fällt weiter.

STORY: Ein Blick zeigt: welches Türchen heute, ob schon gezogen, wer noch im Topf ist. Man drückt den großen Knopf, das Rad dreht, ein Los kommt heraus. Über den Dezember füllt sich die Tafel mit Familienfotos.

FIRST VIEWPORT: Oben Markise über die ganze Breite, darunter Budenschild mit Birnenrand und Datum. Dann die Tagesbühne: übergroße Türchenzahl, Status-Satz, Lose der Teilnehmer als Reihe (gestanzt = schon dran), großer roter Losknopf in Daumenhöhe. Darunter beginnt die 5×5-Gewinnertafel. Laptop: Bühne links, Tafel rechts.

FORM: Losbude am Weihnachtsmarkt, eigene Liste Platz 1 (Pick), Seed 90a5d323. Signatur: Glücksrad mit Lauflicht-Birnen und tickender Zunge (Ton per WebAudio, wenn Sound an), Ergebnis als Los, das aus dem Schlitz fährt.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
Login-Daten liegen nur im localStorage des Setup-Geräts (funktionale Schwäche, nicht Teil dieses Umbaus).
