# Adventskalender Setup-Anleitung

## Für Benutzer: Ersteinrichtung

### Schritt 1: Projekt deployen

1. Klicke auf "Publish" in v0
2. Das Projekt wird automatisch zu Vercel deployed
3. Warte bis das Deployment abgeschlossen ist

### Schritt 2: Supabase-Integration prüfen

Die Supabase-Integration ist bereits verbunden. Folgende Tabellen wurden automatisch erstellt:
- `app_setup` - Setup-Status
- `participants` - Familienmitglieder
- `daily_draws` - Tägliche Ziehungen
- `user_viewed_draws` - Wer welche Animation gesehen hat
- `cycle_state` - Zyklus-Tracking für faire Verteilung
- Storage-Bucket `advent-images` - Für hochgeladene Bilder

### Schritt 3: SQL-Skripte ausführen

Führe die SQL-Skripte in der Supabase-Konsole aus:

1. Gehe zu deiner Supabase-Projekt-Seite
2. Öffne den SQL-Editor
3. Führe `scripts/003_multi_tenant_setup.sql` aus
4. Das erstellt die notwendigen Tabellen und den initialen Admin-Account

**Wichtig:** Die Skripte `001_create_tables.sql` und `002_create_storage_bucket.sql` sollten bereits ausgeführt worden sein. Wenn nicht, führe sie zuerst aus.

### Schritt 4: Erste Anmeldung

1. Öffne deine deployed App-URL
2. Du wirst automatisch zur Setup-Seite weitergeleitet
3. **KEIN Login notwendig** - Du gelangst direkt zum Setup

### Schritt 5: Familie einrichten

1. **Anzahl wählen:** Wähle 3-6 Familienmitglieder aus
2. **Mitglieder anlegen:**
   - Klicke auf "Hinzufügen" um Mitglieder hinzuzufügen
   - Gib für jedes Mitglied einen Namen und ein Passwort ein
   - Wähle genau EIN Mitglied als Admin (Krone-Symbol)
3. **Admin-Rolle:** Der Admin kann:
   - Bilder nachträglich für beliebige Tage hochladen
   - Alle Bilder als ZIP oder Collage herunterladen
   - Bilder ersetzen
4. **Setup abschließen:** Klicke auf "Einrichtung abschließen"

### Schritt 6: Anmeldedaten notieren

Nach dem Setup:
- Die App zeigt dir ALLE Anmeldedaten an (Name + Passwort)
- **WICHTIG:** Speichere diese Anmeldedaten sicher!
- Diese werden auch im Browser gespeichert (localStorage)

### Schritt 7: Fertig!

Jetzt kann sich jedes Familienmitglied mit seinem Namen und Passwort anmelden.

---

## Technische Details

### Datenbank-Struktur

**app_setup**
- `id`: Immer 1 (Singleton)
- `is_setup_complete`: Boolean, zeigt ob Setup abgeschlossen ist
- `family_size`: Anzahl der Familienmitglieder (3-6)
- `setup_completed_at`: Zeitstempel des Setups

**participants**
- `id`: Eindeutige ID (lowercase Name mit Underscores)
- `name`: Anzeigename
- `is_setup_admin`: Boolean, nur für initialen Setup-Admin
- `is_active`: Boolean, nur aktive Teilnehmer können sich anmelden

**daily_draws**
- `day`: Tag 1-25
- `winner_id`: Referenz zu participants.id
- `drawn_at`: Zeitstempel der Ziehung
- `image_url`: URL zum hochgeladenen Bild (Supabase Storage)
- `uploaded_at`: Zeitstempel des Uploads

**user_viewed_draws**
- `user_id`: Referenz zu participants.id
- `day`: Tag 1-25
- Tracking welcher User welche Animation gesehen hat

**cycle_state**
- `id`: Immer 1 (Singleton)
- `current_cycle`: Aktueller Zyklus
- `participants_in_cycle`: Array von Teilnehmer-IDs die im aktuellen Zyklus bereits gewonnen haben

**Storage: advent-images**
- Öffentlicher Bucket für hochgeladene Bilder
- Automatische Namensvergabe: `day-{DAY}-{TIMESTAMP}.{EXT}`

### Ziehungsmechanismus

Der Kalender verwendet einen **fairen Zyklus-Mechanismus**:

1. Bei jeder Ziehung wird ein zufälliger Teilnehmer aus den noch nicht gezogenen des aktuellen Zyklus ausgewählt
2. Sobald alle Teilnehmer einmal gezogen wurden, beginnt ein neuer Zyklus
3. Bei 5 Teilnehmern: Alle 5 Tage hat jeder genau einmal gewonnen
4. Bei 3 Teilnehmern: Alle 3 Tage hat jeder genau einmal gewonnen
5. Bei 6 Teilnehmern: Alle 6 Tage hat jeder genau einmal gewonnen

Dies stellt sicher, dass über 25 Tage jeder ungefähr gleich oft gewinnt:
- 3 Mitglieder: 8-9 Gewinne pro Person
- 4 Mitglieder: 6-7 Gewinne pro Person
- 5 Mitglieder: 5 Gewinne pro Person
- 6 Mitglieder: 4-5 Gewinne pro Person

### Sicherheit

**Wichtig:** Dies ist eine einfache Familien-App ohne echte Authentifizierung!

- Passwörter werden NICHT in der Datenbank gespeichert
- Passwort-Validierung erfolgt im Browser (localStorage)
- Die Supabase-Datenbank ist öffentlich lesbar und schreibbar
- **Nicht für sensible Daten verwenden!**

Für eine produktive Anwendung solltest du:
- Supabase Auth einrichten
- Passwörter hashen und in der DB speichern
- Row Level Security (RLS) richtig konfigurieren
- API-Routes mit Authentifizierung schützen

### Backup & Daten

**Daten sichern:**
- Alle Bilder sind in Supabase Storage gespeichert
- Alle Ziehungen sind in der Datenbank
- Admin kann alle Bilder als ZIP herunterladen

**Neustart:**
- Um neu zu starten, setze `is_setup_complete` in `app_setup` auf `FALSE`
- Lösche alle Einträge in `participants`, `daily_draws`, `user_viewed_draws`
- Setze `cycle_state` zurück

### Anpassungen

**Farben ändern:**
Bearbeite `lib/supabase-helpers.ts` → `PARTICIPANT_COLORS` und `getColorByIndex()`

**Mehr/weniger Tage:**
Die App ist auf 25 Tage (Advent) fixiert. Um dies zu ändern:
- Passe alle Checks für `day <= 25` an
- Ändere die Calendar-Grid-Komponente
- Beachte den Ziehungsmechanismus

**Design anpassen:**
Alle Farben und Styles sind in `app/globals.css` definiert.

---

## Fehlerbehebung

**Setup-Seite wird nicht angezeigt:**
- Prüfe ob das SQL-Skript `003_multi_tenant_setup.sql` ausgeführt wurde
- Prüfe in Supabase ob die Tabelle `app_setup` existiert
- Schaue in die Browser-Konsole nach Fehlern

**Login funktioniert nicht:**
- Prüfe ob localStorage `familyCredentials` enthält
- Nach Setup sollten die Anmeldedaten dort gespeichert sein
- Ggf. localStorage löschen und Setup erneut durchführen

**Bilder werden nicht angezeigt:**
- Prüfe ob der Storage-Bucket `advent-images` öffentlich ist
- Prüfe die RLS-Policies für `storage.objects`
- Schaue in die Browser-Konsole nach 403/404 Fehlern

**Ziehung funktioniert nicht:**
- Prüfe die `cycle_state` Tabelle
- Stelle sicher dass genug Teilnehmer angelegt sind
- Prüfe ob `participants.is_active = true` für alle Mitglieder

---

## Support

Bei Problemen:
1. Prüfe die Browser-Konsole (F12) nach Fehlermeldungen
2. Prüfe die Supabase-Logs im Dashboard
3. Stelle sicher dass alle SQL-Skripte ausgeführt wurden
4. Prüfe ob alle Environment-Variablen korrekt gesetzt sind

**Environment-Variablen** (sollten automatisch von v0 gesetzt sein):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
