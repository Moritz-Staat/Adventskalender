# Deployment-Anleitung

## Vorbereitung

Bevor du das Projekt deployst, stelle sicher, dass du:

1. Alle SQL-Migrations-Scripts in deiner Supabase-Datenbank ausgeführt hast
2. Die Environment Variables notiert hast
3. Das Projekt lokal getestet hast

## Deployment auf Vercel

### Schritt 1: GitHub Repository

```bash
# Initialisiere Git (falls noch nicht geschehen)
git init
git add .
git commit -m "Initial commit"

# Erstelle ein neues Repository auf GitHub und pushe
git remote add origin https://github.com/dein-username/adventskalender.git
git branch -M main
git push -u origin main
```

### Schritt 2: Mit Vercel verbinden

1. Gehe zu [vercel.com](https://vercel.com)
2. Klicke auf "New Project"
3. Importiere dein GitHub Repository
4. Wähle "Next.js" als Framework (wird automatisch erkannt)

### Schritt 3: Environment Variables hinzufügen

Füge in den Vercel Project Settings folgende Environment Variables hinzu:

```
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
```

### Schritt 4: Deployen

Klicke auf "Deploy" - Vercel baut und deployed deine App automatisch.

Deine App ist dann verfügbar unter: `https://dein-projekt.vercel.app`

## Deployment auf anderen Plattformen

### Netlify

1. Pushe zu GitHub
2. Verbinde mit Netlify
3. Build Command: `npm run build`
4. Publish Directory: `.next`
5. Füge Environment Variables hinzu

### Railway.app

1. Erstelle ein neues Projekt auf Railway
2. Verbinde mit GitHub
3. Füge Environment Variables hinzu
4. Railway deployed automatisch

### Eigener Server (VPS)

```bash
# Auf dem Server
git clone https://github.com/dein-username/adventskalender.git
cd adventskalender

# Environment Variables erstellen
nano .env.local
# Füge NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY hinzu

# Installieren und bauen
npm install
npm run build

# Mit PM2 starten (Production)
npm install -g pm2
pm2 start npm --name "adventskalender" -- start

# Nginx Reverse Proxy konfigurieren
# ...
```

## Domain konfigurieren

### Bei Vercel

1. Gehe zu Project Settings → Domains
2. Füge deine Domain hinzu
3. Konfiguriere DNS-Einträge bei deinem Domain-Provider

### DNS-Konfiguration

Füge einen CNAME-Eintrag hinzu:

```
Type: CNAME
Name: @ (oder subdomain)
Value: cname.vercel-dns.com
```

## Post-Deployment

### Initial-Setup durchführen

1. Öffne deine deployed App
2. Logge dich als `admin/admin` ein
3. Richte deine Familie ein
4. Fertig!

### Monitoring

- Prüfe die Vercel Logs auf Fehler
- Prüfe Supabase Dashboard → Logs
- Setze Alerts in Supabase für kritische Fehler

## Backup

### Datenbank Backup

Supabase erstellt automatisch tägliche Backups. Du kannst auch manuelle Backups erstellen:

```bash
# Export via Supabase CLI
supabase db dump > backup.sql
```

### Bilder Backup

Die Admin-Funktion "Alle Bilder herunterladen" erstellt ein ZIP-Backup aller hochgeladenen Bilder.

## Updates

```bash
# Lokale Änderungen pushen
git add .
git commit -m "Update"
git push

# Vercel deployed automatisch nach jedem Push
