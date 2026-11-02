# Betrieb auf intelnuc

Live unter `adventskalender.staatsprojekte.uk`: Cloudflare-Tunnel → Nginx Proxy Manager → Container `adventskalender:3000`.
Daten liegen in `~/stacks/adventskalender/data` (`advent.db` plus `images/`).

```sh
cd ~/stacks/adventskalender && docker compose up -d --build     # bauen und starten
docker compose exec adventskalender node scripts/manage.mjs setup Moritz Claudia Christian Ella Clara
docker compose exec adventskalender node scripts/manage.mjs password Ella    # neues Passwort
docker compose exec adventskalender node scripts/manage.mjs new-season       # vor jedem neuen Dezember
```

Der erste Name bei `setup` wird Admin. Ausgelost werden kann nur vom 1. bis 25. Dezember (deutsche Zeit);
zum Testen setzt `ADVENT_TEST_DAY=<1-25>` im Container den heutigen Tag fest.
