# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Eine erwachsene Familie (Eltern, erwachsene bzw. jugendliche Kinder, 3–6 Personen), alle digital fit. Sie öffnen die App im Dezember täglich, überwiegend auf dem Handy, gelegentlich am Laptop.

## Product Purpose
Ein privater Familien-Adventskalender: Jeden Tag vom 1. bis 25. Dezember wird per Glücksrad ausgelost, wer das Türchen öffnen darf. Die Gewinnerin bzw. der Gewinner lädt ein Foto mit dem Geschenk hoch; über den Dezember füllt sich der Kalender mit diesen Fotos. Erfolg: Die tägliche Auslosung fühlt sich wie ein kleines Ereignis an, und am Ende steht ein gemeinsames Fotoalbum des Dezembers.

## Positioning
Kein Kalender, der Inhalte hinter Türchen versteckt, sondern ein faires Familien-Losverfahren: Zyklus-Logik sorgt dafür, dass niemand zweimal dran ist, bevor alle einmal gewonnen haben. Die Türchen werden durch die Fotos der Familie selbst gefüllt.

## Operating Context
- Täglicher Ritual-Moment: einloggen, auslosen (oder die Auslosung eines anderen beim ersten Login nachträglich als Animation sehen), Gewinner sieht Upload-Aufforderung.
- Foto-Upload direkt per Handykamera oder Galerie.
- Admin (eine Person) kann für jeden Tag Bilder nachträglich hochladen, alle Bilder als ZIP oder als Collage herunterladen.
- Ersteinrichtung (Setup-Seite) legt 3–6 Familienmitglieder mit Passwort und einen Admin an.

## Capabilities and Constraints
- Next.js 16 + React 19 + Tailwind 4 + framer-motion, Daten in SQLite, Fotos als Dateien, Docker-Container auf dem intelnuc (siehe DEPLOYMENT.md).
- Tage 1–25, Monat fest Dezember. Der Server bestimmt den Tag; zum Testen setzt `ADVENT_TEST_DAY` ihn fest.
- Teilnehmerfarben sind UI-only (Mapping in `lib/api.ts`), nicht in der DB.
- Einstellungen Sound/Konfetti werden lokal gespeichert.
- Alle Funktionen, Texte und Abläufe bleiben erhalten; der visuelle Auftritt ist frei.

## Brand Commitments
- Name: „Familien-Adventskalender“. Sprache Deutsch, Du-Ansprache, warm und knapp.
- Schneefall im Hintergrund bleibt (vom Nutzer als bindend benannt).

## Evidence on Hand
Echte Inhalte sind nur die Familiennamen und die im Dezember hochgeladenen Fotos (Datenordner auf dem Server). Keine Platzhalter-Fotos als echt ausgeben.

## Product Principles
- Der tägliche Moment zählt: Auslosung und Kalender sind gleichwertige Hauptdarsteller.
- Handy zuerst: Daumenreichweite, ein Blick erklärt den Stand des Tages.
- Fairness sichtbar machen: wer schon dran war, wer noch im Topf ist.
- Die Fotos der Familie sind der eigentliche Inhalt; das Design rahmt sie.
