---
name: Familien-Adventskalender
description: Die Losbude der Familie auf dem Weihnachtsmarkt, mit Glücksrad, Losen und Gewinnertafel.
colors:
  night: "#1a0f0d"
  night-2: "#241512"
  plank: "#321c17"
  plank-edge: "#4a2a22"
  awning-red: "#c41e32"
  awning-red-deep: "#8f1424"
  cream: "#f4ead6"
  cream-dim: "#c9b39c"
  bulb: "#ffd27a"
  bulb-core: "#fff4d6"
  brass: "#e8b03a"
  ink: "#2a1712"
  destructive: "#ff8a7a"
  ticket-mint: "#9fd9c3"
  ticket-rose: "#f4a7b5"
  ticket-gold: "#f5d26a"
  ticket-sky: "#a9c7f1"
  ticket-lilac: "#cab4ee"
typography:
  display:
    fontFamily: "Rye, Georgia, serif"
    fontSize: "clamp(1.6rem, 7.7vw, 3rem)"
    fontWeight: 400
    lineHeight: 0.95
  headline:
    fontFamily: "Rye, Georgia, serif"
    fontSize: "1.4rem"
    fontWeight: 400
    lineHeight: 1
  numeral:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "5.5rem"
    fontWeight: 800
    lineHeight: 0.78
    letterSpacing: "-0.02em"
    fontFeature: "\"tnum\", \"lnum\""
  ticket-name:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "2.4rem"
    fontWeight: 800
    lineHeight: 1.05
  title:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.375
  body:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.2em"
rounded:
  stamp: "7px"
  md: "8px"
  tile: "10px"
  lg: "10px"
  xl: "14px"
  plank: "16px"
spacing:
  tile-gap: "6px"
  tile-gap-md: "10px"
  page-x: "16px"
  page-x-md: "32px"
  plank-pad: "20px"
  plank-pad-md: "24px"
  section-gap: "48px"
components:
  button-booth:
    backgroundColor: "{colors.awning-red}"
    textColor: "{colors.cream}"
    rounded: "{rounded.plank}"
    height: "56px"
  button-booth-draw:
    backgroundColor: "{colors.awning-red}"
    textColor: "{colors.cream}"
    rounded: "{rounded.plank}"
    height: "72px"
  button-quiet:
    backgroundColor: "{colors.plank-edge}"
    textColor: "{colors.cream}"
    rounded: "{rounded.xl}"
    height: "56px"
  plank-card:
    backgroundColor: "{colors.plank}"
    textColor: "{colors.cream}"
    rounded: "{rounded.plank}"
    padding: "20px"
  mounted-sign:
    backgroundColor: "{colors.awning-red}"
    textColor: "{colors.cream}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
    padding: "8px 28px 10px"
  ticket:
    backgroundColor: "{colors.ticket-sky}"
    textColor: "{colors.ink}"
    typography: "{typography.ticket-name}"
    height: "40px"
  field:
    backgroundColor: "rgb(255 255 255 / 0.55)"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "48px"
  day-tile-future:
    backgroundColor: "{colors.night}"
    textColor: "{colors.cream}"
    rounded: "{rounded.tile}"
  day-tile-today:
    backgroundColor: "{colors.awning-red}"
    textColor: "{colors.cream}"
    rounded: "{rounded.tile}"
  name-stamp:
    backgroundColor: "{colors.ticket-mint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    size: "40px"
---

# Design System: Familien-Adventskalender

## Overview

**Creative North Star: "Die Losbude am Weihnachtsmarkt"**

Die App ist eine beleuchtete Losbude bei Nacht. Eine rot-creme gestreifte Markise mit Bogenkante schließt jede Vollbildfläche oben ab, darunter hängen lackierte Holzschilder mit Glühbirnenrand. Inhalte liegen auf diesen Brettern, nicht auf Karten. Lose aus Pastellpapier tragen die Namen, die 25 Tage sind eine Gewinnertafel, das Glücksrad mit Lauflicht ist das Hauptobjekt.

Licht kommt warm von oben (Bernstein-Schein über dem Nachtgrund), alles Helle ist Glühbirne, Messing oder Papier. Der Schneefall im Hintergrund ist Markenbindung und bleibt. Dichte: handyhoch, ein Blick erklärt den Tag; große Ziffern, wenige Wörter.

Verworfen: das Karten-Dashboard auf Creme mit Tannengrün und Emoji-Deko, Neonfarben.

**Key Characteristics:**
- Nachtgrund in Rotbraun-Schwarz, nie reines Schwarz oder Grau.
- Markise, Brett, Glühbirne, Los, Messing als einzige Materialien.
- Drei Schriften mit festen Rollen: Schaustellerschrift, Plakatgrotesk, ruhige Grotesk.
- Pro Person eine Papierfarbe, durchgängig auf Los, Marke, Tafel und Statistik.
- Ein einziges beleuchtetes Feld: heute.

## Colors

Warmes Nachtlicht: dunkle Holz- und Nachttöne, ein kräftiges Markisenrot, Creme und Bernsteinlicht, dazu fünf Pastellpapiere für Personen.

### Primary
- **Markisenrot** (awning-red): Markisenstreifen, Hauptknopf, montierte Schilder, heutiges Tafelfeld. Die einzige gesättigte Fläche.
- **Tiefes Markisenrot** (awning-red-deep): Extrusion der Schildschrift, Stern auf dem Gewinnerlos, Fehlertext auf Papier.

### Secondary
- **Glühbirnenlicht** (bulb) und **Birnenkern** (bulb-core): Birnen, Fokusring, Textauswahl, Rahmen des heutigen Feldes, Akzenttext über dem Rad.
- **Messing** (brass): Knopfrand, Schildschrauben, Radring, Losausgabe.

### Tertiary
- **Losfarben** (ticket-mint, ticket-rose, ticket-gold, ticket-sky, ticket-lilac): Papierfarbe je Person, Zuordnung in `lib/supabase-helpers.ts`. Text darauf ist immer Tinte.

### Neutral
- **Budennacht** (night): Seitengrund, eingelassene Zukunftsfelder.
- **Nacht 2** (night-2): Popover, Dialoge, Toasts, offene Felder ohne Ziehung.
- **Brett** (plank) und **Brettkante** (plank-edge): lackierte Schilder; Kante auch als stiller Knopf und Scrollbar.
- **Creme** (cream) und **Creme gedämpft** (cream-dim): Text auf Holz; gedämpft für Datum, Zähler, Hinweise.
- **Tinte** (ink): Text auf Papier und Losen.
- **Fehler hell** (destructive): Fehlermeldungen auf dunklem Grund.

### Named Rules
**The Warmlicht-Regel.** Alles Leuchtende ist Bernstein oder Creme. Keine Neonfarben, kein kaltes Weiß, kein Blau als Licht.

**The Ein-Licht-Regel.** Auf der Gewinnertafel leuchtet nur das heutige Feld (Rot mit Birnenring und pulsierendem Schein). Andere Felder bleiben unbeleuchtet.

**The Papier-gleich-Person-Regel.** Losfarben bezeichnen ausschließlich Personen. Sie tragen keine Status- oder Dekorbedeutung.

## Typography

**Display Font:** Rye (mit Georgia, serif)
**Ziffern/Los-Font:** Big Shoulders (mit Arial Narrow)
**Body Font:** Figtree (mit ui-sans-serif, system-ui)

**Character:** Rye ist die Schaustellerschrift der Schilder, Big Shoulders die schmale Plakatgrotesk der Losdrucke und Türchenzahlen, Figtree trägt alles Lesbare ruhig.

### Hierarchy
- **Display** (Rye 400, clamp(1.6rem, 7.7vw, 3rem), 0.95): App-Name auf dem Budenschild, einzeilig.
- **Headline** (Rye 400, 1.4rem / md 1.7rem, 1): Titel auf montierten Schildern (Gewinnertafel, Gewinnliste, Ziehungsprotokoll), Rad-Titel 2rem.
- **Numeral** (Big Shoulders 800, 5.5rem / md 6.5rem, 0.78, -0.02em, Tabellenziffern): Türchenzahl der Tagesbühne; kleiner auf Tafelfeldern (1.55rem / md 2rem) und im Protokoll (1.5rem).
- **Ticket-Name** (Big Shoulders 800, 2.4–2.75rem, Versalien): Gewinnername auf dem Los.
- **Title** (Figtree 700, 1.25rem / md 1.5rem): Status-Satz der Bühne, Dialogtitel.
- **Body** (Figtree 400–600, 0.875rem, Zeilen 1.5): Hinweise, Zähler, Loszeilen (15px, 600).
- **Label** (Big Shoulders 700, 11–14px, 0.14–0.3em, Versalien): Aufdruck auf Losen und Messing (LOS, LOSAUSGABE) und datentragende Zeilen (Fotozahl, Losanzahl, Durchgangswechsel).

### Named Rules
**The Schild-Regel.** Rye nur auf Schildern und mit Extrusionsschatten (sign-text). Nie für Fließtext, Knöpfe oder Formularbeschriftung.

**The Aufdruck-Regel.** Versal-Labels mit Sperrung tragen immer Daten oder sind Losaufdruck. Kein Label ohne Information über einer Überschrift.

## Layout

Handy zuerst (390px). Seitenrand 16px, ab md 32px, Inhalt max. 72rem zentriert. Markise über die volle Breite, Budenschild leicht darunter. Mobil eine Spalte in fester Reihenfolge: Tagesbühne, Gewinnertafel, Statistik, Protokoll, Abstand 48px. Ab lg zwei Spalten 5fr / 7fr: Bühne und Statistik links, Tafel und Protokoll rechts, Zeilenabstand 56px. Die Tafel ist ein festes 5×5-Raster quadratischer Felder (Lücke 6px, md 10px). Der Losknopf sitzt in Daumenhöhe als volle Breite der Bühne. Das Rad-Modal ist vollflächig mit eigener Markise; Radgröße an Viewport-Höhe gekoppelt (min(88vw, 50dvh, 420px)), schrumpft nach dem Ergebnis. Safe-Area unten wird respektiert.

## Elevation & Depth

Tiefe entsteht physisch: Bretter werfen weiche, tiefe Schatten auf die Nacht, Knöpfe haben Messingrand und Bodenschatten, Zukunftsfelder sind ins Brett eingelassen (Innenschatten), gestanzte Löcher sind Innenschatten in Brettfarbe. Licht ist ein additiver Bernsteinschein von oben (Seite, Brettkanten, Bühne).

### Shadow Vocabulary
- **Brett** (`inset 0 1px 0 rgb(255 255 255 / 0.06), 0 18px 40px -18px rgb(0 0 0 / 0.75)`): jedes lackierte Schild.
- **Buden-Knopf** (`inset 0 0 0 2px rgb(232 176 58 / 0.85), 0 10px 22px -8px rgb(143 20 36 / 0.75), 0 3px 6px rgb(0 0 0 / 0.35)`): Hauptknopf; gedrückt flacher.
- **Eingelassen** (`inset 0 2px 6px rgb(0 0 0 / 0.6), inset 0 0 0 1px rgb(244 234 214 / 0.05)`): Zukunftsfelder.
- **Papier** (`0 3px 7px rgb(0 0 0 / 0.4)`): Lose und Fotos auf der Tafel.
- **Birnenschein** (`0 0 6px 1px rgb(255 210 122 / 0.75)`): Glühbirnen.
- **Heute** (`0 0 0 2px var(--bulb), 0 4px 14px rgb(255 190 110 / 0.35)`): pulsiert auf 22px.
- **Schildschrift** (gestapelt 1/2/3px in tiefem Rot plus 6px 14px Schatten): Extrusion der Rye-Schrift.

### Named Rules
**The Schwerkraft-Regel.** Schatten fallen nach unten und sind weich. Harte versetzte Schlagschatten gibt es nur als Schriftextrusion auf Schildern.

## Shapes

Weich gerundete Bretter (16px), Knöpfe 16px bzw. still 14px, Felder und Marken 7–14px je Größe, montierte Schilder 10px. Der Los-Umriss ist die Signatur: rechteckiges Papier mit halbrunden Stanzkerben links und rechts (7px, groß 10–12px), Abriss als gepunktete Perforation. Die Markise endet unten in Bögen (Radius 13px pro 44px-Streifen). Personen erscheinen als quadratische Papiermarke mit Initiale, nie als runder Avatar. Ikonen sind gezeichnete SVG (Stern, Tannensignet) oder Lucide-Linien.

## Components

### Buttons
- **Buden-Knopf:** lackiertes Rot mit Messingrand, Figtree 800, Höhe 56px, Losknopf 72px mit Birnenreihe innen. Hover hellt 7% auf, Active senkt 2px und flacht den Schatten ab (160ms, ease-out-expo). Disabled entsättigt.
- **Stiller Knopf:** Brettkante, Figtree 700, für Nebenaktionen (Galerie, Neu wählen, Weiter zur Tafel). Hover hellt 12% auf, Active senkt 2px.
- **Fokus:** 2px Birnenlicht-Outline mit 3px Abstand, global.

### Cards / Containers
- **Brett:** Brettfarbe mit Lackglanz und feiner Maserung, 1px Brettkante, Brett-Schatten, Innenabstand 20px / md 24px. Abschnittsbretter tragen oben ein montiertes rotes Schild mit zwei Messingschrauben, das halb über die Kante ragt.
- **Budenschild (Kopf):** Brett mit Birnenreihen oben und unten (laufend) und Lichtschein an beiden Kanten.

### Inputs / Fields
- **Stil:** auf Papier (Eintrittskarte beim Login): halbtransparentes Weiß, 2px Tinte 15%, 14px Radius, Höhe 48px, Tinte als Text, Caret Birnenlicht.
- **Fokus:** Rand Tinte 60%, Fläche heller.
- **Fehler:** tiefes Rot auf Papier, helles Fehlerrot auf Nacht; Karte schüttelt kurz.

### Navigation
- Keine Navigationsleiste. Kopf ist das Budenschild mit Datum und eigener Namensmarke als Menüauslöser; Menü im Nacht-2-Popover mit Lucide-Ikonen.

### Los (Signatur)
Pastellpapier mit Punktraster, Stanzkerben, Tinte als Text. Klein (40px) im Lostopf: gestanzt mit Loch und entsättigt, wenn die Person im Durchgang schon dran war; Gewinner mit Birnenring und Stern. Groß als Gewinnerlos: links LOS plus Nummer, Perforation, rechts Name in Versalien.

### Glücksrad (Signatur)
Holzrand mit doppeltem Messingring und Lauflicht-Birnen (langsam 2.4s, Drehung 0.36s, Ergebnis 1.4s), Segmente in Losfarben, Messingzunge, Losausgabe als Messingplatte mit Schlitz, aus dem das Los herausfährt (0.9s).

### Gewinnertafel
5×5 Felder: Zukunft eingelassen und dunkel, vergangen ohne Ziehung Nacht 2, gezogen in Losfarbe mit Name, mit Foto als Bild mit Zahl auf dunklem Plättchen und Initialmarke, heute rot beleuchtet mit Stern.

## Do's and Don'ts

### Do:
- **Do** jede Vollbildfläche mit der Markise (56px, Bogenkante) oben abschließen.
- **Do** Inhalte auf Bretter setzen, Abschnittstitel als montiertes Schild in Rye.
- **Do** Personen immer in ihrer Losfarbe zeigen, mit Tinte als Text.
- **Do** Zahlen in Big Shoulders mit Tabellenziffern setzen.
- **Do** Bewegung mit cubic-bezier(0.16, 1, 0.3, 1) und bei reduzierter Bewegung alle Dauerschleifen (Lauflicht, Heute-Puls) anhalten.

### Don't:
- **Don't** Neonfarben, kaltes Weiß oder Grau als Grund verwenden.
- **Don't** Emoji als Deko oder Ikone; Sterne und Bäume werden als SVG gezeichnet.
- **Don't** runde Avatare; Personen sind Papiermarken mit Initiale.
- **Don't** mehr als ein Tafelfeld beleuchten.
- **Don't** Rye außerhalb von Schildern setzen.
