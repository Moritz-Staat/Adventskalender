# Adventskalender - Familien-Auslosungs-App

Eine interaktive Adventskalender-Anwendung für Familien mit täglicher Auslosung und Bild-Upload-Funktion.

## Features

- Tägliche Auslosung eines Gewinners mit animiertem Glücksrad
- Bild-Upload für jeden Tag (mit Kamera oder Galerie)
- Faire 5-Tage-Zyklus-Logik (bei 5 Teilnehmern)
- Admin-Funktionen:
  - Nachträgliches Hochladen von Bildern
  - Download aller Bilder als ZIP
  - Download als Weihnachts-Collage
- Statistiken und Historie
- Weihnachtliche Animationen (Schneefall, Lichterketten)
- Multi-Tenant-fähig: Jede Familie richtet ihre eigenen Teilnehmer ein

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage)
- **Authentifizierung**: Simple Login-System (ohne OAuth)
- **Deployment**: Vercel (oder jeder Node.js-Host)

## Voraussetzungen

- Node.js 18+ 
- npm oder yarn
- Ein Supabase-Account (kostenlos)
- (Optional) Vercel-Account für Deployment

## Installation

### 1. Repository klonen

```bash
git clone https://github.com/dein-username/adventskalender.git
cd adventskalender
npm install
```

### 2. Supabase-Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com) und erstelle einen kostenlosen Account
2. Erstelle ein neues Projekt
3. Notiere dir:
   - **Project URL** (z.B. `https://xxx.supabase.co`)
   - **Anon/Public Key** (findest du unter Settings → API)

### 3. Environment Variables konfigurieren

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
```

### 4. Datenbank einrichten

Führe die SQL-Migrations-Scripts in deiner Supabase-Datenbank aus:

1. Öffne dein Supabase Dashboard
2. Gehe zu **SQL Editor**
3. Führe die Scripts in dieser Reihenfolge aus:

**Script 1: Basis-Tabellen** (`scripts/001_create_tables.sql`)
```sql
-- Siehe scripts/001_create_tables.sql
```

**Script 2: Storage Bucket** (`scripts/002_create_storage_bucket.sql`)
```sql
-- Siehe scripts/002_create_storage_bucket.sql
```

**Script 3: Multi-Tenant Setup** (`scripts/003_multi_tenant_setup.sql`)
```sql
-- Siehe scripts/003_multi_tenant_setup.sql
```

### 5. Lokal starten

```bash
npm run dev
```

Die App läuft jetzt auf `http://localhost:3000`

## Erste Schritte

### Initial-Setup

1. Öffne die App zum ersten Mal
2. Logge dich mit den Initial-Credentials ein:
   - **Benutzername**: `admin`
   - **Passwort**: `admin`
3. Du wirst zum Setup-Bildschirm weitergeleitet

### Familie einrichten

1. Wähle die Anzahl der Familienmitglieder (3-6 Personen)
2. Gib für jedes Mitglied ein:
   - **Name** (z.B. "Moritz")
   - **Passwort** (frei wählbar)
3. Wähle einen Admin aus (hat Sonderrechte)
4. Klicke auf "Familie einrichten"
5. Der Initial-Admin wird automatisch deaktiviert

**Wichtig:** Nach dem Setup kannst du dich nicht mehr als Initial-Admin einloggen. Merke dir die neuen Zugangsdaten!

### Tägliche Nutzung

1. Jedes Familienmitglied loggt sich mit seinem Namen und Passwort ein
2. Beim ersten Login des Tages sieht jeder die Auslosungs-Animation
3. Der Gewinner kann ein Bild hochladen (mit Kamera oder aus der Galerie)
4. Alle sehen die hochgeladenen Bilder im Kalender

### Admin-Funktionen

Der gewählte Admin hat zusätzliche Rechte:

- **Nachträgliches Hochladen**: Klicke auf beliebige Tage um Bilder hochzuladen/zu ersetzen
- **Alle Bilder herunterladen**: Dropdown-Menü → "Alle Bilder herunterladen" (als ZIP)
- **Collage erstellen**: Dropdown-Menü → "Als Collage herunterladen" (weihnachtliches Grid)

## Deployment

### Option 1: Vercel (Empfohlen)

1. Pushe dein Repository zu GitHub
2. Gehe zu [vercel.com](https://vercel.com) und importiere das Repository
3. Füge die Environment Variables hinzu:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploye

### Option 2: Andere Hosts

Die App ist eine Standard-Next.js-App und kann auf jedem Node.js-Host deployed werden:

```bash
npm run build
npm start
```

## Konfiguration

### Teilnehmerzahl ändern

Die Teilnehmerzahl wird beim Initial-Setup festgelegt (3-6 Personen). Um sie später zu ändern, musst du:

1. Die `participants` Tabelle in Supabase leeren
2. Den `setup_status` zurücksetzen: `UPDATE setup_status SET is_setup_complete = false`
3. Das Setup erneut durchführen

### Ziehungs-Mechanismus

- **3-4 Teilnehmer**: Jeder gewinnt alle 3-4 Tage
- **5 Teilnehmer**: Faire 5-Tage-Zyklen (wie im Original)
- **6 Teilnehmer**: Jeder gewinnt alle 6 Tage

Die Auslosung ist zufällig innerhalb jedes Zyklus, aber jeder kommt gleich oft dran.

## Datenbank-Schema

### Tabellen

- **participants**: Familienmitglieder mit Namen und Passwort-Hash
- **daily_draws**: Tägliche Ziehungen mit Gewinner und Bild-URL
- **user_viewed_draws**: Tracking welcher User die Animation gesehen hat
- **cycle_state**: Verwaltung der fairen Zyklus-Logik
- **setup_status**: Status des Initial-Setups

### Storage

- **advent-images**: Bucket für alle hochgeladenen Bilder

## Sicherheit

- Passwörter werden mit bcrypt gehasht (10 Rounds)
- Row Level Security (RLS) auf allen Tabellen aktiviert
- Public Access (keine Supabase Auth) - für Familien-Nutzung ausreichend
- Bei sensiblen Daten: Implementiere Supabase Auth

## Troubleshooting

### Bilder werden nicht angezeigt

1. Prüfe ob der Storage Bucket `advent-images` existiert
2. Prüfe die RLS Policies auf `storage.objects`
3. Prüfe die Browser Console auf CORS-Fehler

### Login funktioniert nicht

1. Prüfe ob die `participants` Tabelle Einträge hat
2. Prüfe ob das Setup abgeschlossen ist (`setup_status.is_setup_complete = true`)
3. Lösche den localStorage und versuche es erneut

### Ziehung funktioniert nicht

1. Prüfe ob `cycle_state` initialisiert ist
2. Prüfe die Browser Console auf Fehler
3. Prüfe ob die `daily_draws` Tabelle schreibbar ist

## Entwicklung

### Lokale Entwicklung mit Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Start Supabase lokal
supabase start

# Migrations anwenden
supabase db push
```

### Debug-Logs

Die App nutzt `console.log("[v0] ...")` für Debug-Ausgaben. Diese können in der Browser Console eingesehen werden.

## Lizenz

MIT

## Credits

Entwickelt mit Next.js, Supabase und viel Weihnachtsstimmung.
