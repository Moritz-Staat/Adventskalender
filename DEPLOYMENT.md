# Betrieb auf dem intelnuc

Live unter `adventskalender.staatsprojekte.uk`: Cloudflare-Tunnel → Nginx Proxy Manager → Container `adventskalender:3000`.

Alles liegt in `~/stacks/adventskalender` (Git-Klon von `main`). Datenbank und Fotos liegen in `data/` und sind nicht in Git.

## Aktualisieren

```sh
cd ~/stacks/adventskalender
git pull --ff-only
docker compose up -d --build
```

## Verwaltung

Der erste Name bei `setup` wird Admin. Passwörter werden nur einmal ausgegeben und gehören in Vaultwarden.

```sh
docker compose exec adventskalender node scripts/manage.mjs setup Moritz Claudia Christian Ella Clara
docker compose exec adventskalender node scripts/manage.mjs password Ella    # neues Passwort, meldet Ella überall ab
docker compose exec adventskalender node scripts/manage.mjs new-season       # vor jedem neuen Dezember
```

`new-season` leert Ziehungen und Lostopf. Alte Fotos bleiben in `data/images/` liegen und werden nicht mehr angezeigt.

## Testen außerhalb des Dezembers

Eine `docker-compose.override.yml` neben der Compose-Datei legt den Tag fest:

```yaml
services:
  adventskalender:
    environment:
      ADVENT_TEST_DAY: "1"
```

Nach `docker compose up -d` gilt der Tag. Zum Aufräumen die Datei löschen, erneut `docker compose up -d` ausführen, `new-season` aufrufen und `data/images/` leeren.

## Backup

`~/backup.sh` läuft sonntags um 02:00 und sichert einen konsistenten Snapshot der Datenbank sowie die Fotos auf Google Drive.
