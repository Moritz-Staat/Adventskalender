# Familien-Adventskalender

Ein privater Adventskalender für die Familie. Vom 1. bis 25. Dezember wird täglich per Glücksrad ausgelost, wer das Türchen öffnen darf. Der Gewinner lädt ein Foto mit dem Geschenk hoch, und über den Dezember füllt sich die Gewinnertafel.

Live: https://adventskalender.staatsprojekte.uk

## Funktionen

**Für alle**
- Auslosen, sobald der Tag dran ist. Wer zuerst kommt, startet das Rad, alle anderen sehen die Ziehung beim nächsten Besuch.
- Faire Zyklen: Niemand gewinnt zum zweiten Mal, bevor alle einmal dran waren.
- Fotos in der Gewinnertafel ansehen, dazu Statistik und Verlauf.
- Eigenes Foto hochladen, auch nachträglich: Wer es am Gewinntag vergisst, tippt später in der Gewinnertafel auf sein Feld mit dem Kamera-Symbol. Fremde Felder bleiben gesperrt.
- Ton und Konfetti lassen sich pro Gerät abschalten.

**Für den Admin**
- Foto für jeden ausgelosten Tag hochladen oder ersetzen.
- Alle Fotos als ZIP oder als Collage herunterladen.

Außerhalb des Zeitraums zeigt die App „Heute ist kein Adventstag“ und lost nicht aus. Es zählt die deutsche Zeit auf dem Server, nicht die Uhr des Geräts.

## Technik

| Bereich | Lösung |
|---|---|
| Oberfläche | Next.js 16, React 19, Tailwind CSS 4, framer-motion |
| Daten | SQLite (`better-sqlite3`) in `data/advent.db` |
| Fotos | Dateien in `data/images/`, bis 25 MB; JPEG, PNG, WebP, GIF, HEIC |
| Login | scrypt-Hashes, Sitzungs-Cookie (120 Tage), serverseitig gespeichert |
| Betrieb | Docker auf dem intelnuc, davor Nginx Proxy Manager und Cloudflare-Tunnel |

```text
app/page.tsx          Einstieg: Sitzung prüfen, Login oder Kalender zeigen
app/api/              Server-Routen, siehe unten
components/           Oberfläche
lib/api.ts            Alle Serveraufrufe aus dem Browser
lib/server/core.mjs   Datenbankschema, Passwörter (auch von manage.mjs genutzt)
lib/server/db.ts      Sitzungen, Antworten, aktueller Adventstag
scripts/manage.mjs    Verwaltung auf der Kommandozeile
```

### Server-Routen

| Route | Zweck | Zugriff |
|---|---|---|
| `GET /api/session` | Eingerichtet? Wer ist angemeldet? | offen |
| `POST /api/auth/login`, `/logout` | Anmelden, abmelden | offen, 10 Fehlversuche je IP in 15 Minuten |
| `GET /api/state` | Teilnehmer, Ziehungen, Fotos, Lostopf, heutiger Tag | angemeldet |
| `POST /api/draw` | Heutigen Tag auslosen, ein zweiter Aufruf liefert denselben Gewinner | angemeldet |
| `GET`, `POST /api/viewed` | Hat die Person die heutige Ziehung schon gesehen? | angemeldet |
| `POST /api/images` | Foto hochladen | Gewinner des Tages oder Admin |
| `GET /api/images/<name>` | Foto abrufen | angemeldet |
| `POST /api/setup` | Einrichtung über das Formular | gesperrt ohne `SETUP_ENABLED=true` |
| `GET /api/health` | Healthcheck des Containers | offen |

### Einstellungen

| Variable | Wirkung |
|---|---|
| `DATA_DIR` | Ort von Datenbank und Fotos, im Container `/data` |
| `ADVENT_TEST_DAY` | Legt den heutigen Tag fest (1 bis 25), nur zum Testen |
| `SETUP_ENABLED` | `true` öffnet das Einrichtungsformular, solange niemand angelegt ist |

## Lokal entwickeln

Voraussetzung sind Node.js 22 und pnpm.

```bash
pnpm install
node scripts/manage.mjs setup Moritz Claudia Christian   # erster Name = Admin, druckt die Passwörter aus
ADVENT_TEST_DAY=1 pnpm dev
```

Die App läuft dann unter `http://localhost:3000`, die Daten liegen in `./data`. Das Verzeichnis ist nicht in Git.

## Betrieb

Aktualisieren, Passwörter, neue Saison und Backup stehen in [DEPLOYMENT.md](DEPLOYMENT.md).

## Lizenz

MIT
