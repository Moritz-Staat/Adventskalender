# Adventskalender - Familien-Auslosungs-App

Eine interaktive Adventskalender-Anwendung für Familien mit täglicher Auslosung und Bild-Upload.

## Features

- Tägliche Auslosung mit animiertem Glücksrad, vom 1. bis 25. Dezember
- Faire Zyklen: Jede Person kommt gleich oft dran
- Bild-Upload für den Gewinner (Kamera oder Galerie)
- Admin: Bilder nachträglich hochladen, alle als ZIP oder Collage herunterladen
- Statistik und Verlauf

## Tech Stack

Next.js 16, React, TypeScript, Tailwind CSS, SQLite (better-sqlite3). Fotos liegen als Dateien im Datenordner.
Login serverseitig mit scrypt-Hashes und Sitzungs-Cookie; Fotos und Stand sind nur angemeldet erreichbar.

## Lokal entwickeln

```bash
pnpm install
ADVENT_TEST_DAY=1 pnpm dev
node scripts/manage.mjs setup Moritz Claudia Christian   # erster Name = Admin, druckt die Passwörter aus
```

Daten landen in `./data`, ein anderer Ort geht über `DATA_DIR`. `ADVENT_TEST_DAY` setzt das heutige Türchen fest,
sonst lässt sich außerhalb vom Dezember nichts auslosen.

Betrieb und Verwaltung: siehe [DEPLOYMENT.md](DEPLOYMENT.md).

## Lizenz

MIT
