# Alternative Datenbanken

Obwohl dieses Projekt für Supabase entwickelt wurde, kannst du auch andere PostgreSQL-Datenbanken verwenden.

## Eigene PostgreSQL-Datenbank

### 1. PostgreSQL installieren

```bash
# Auf Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# Auf macOS mit Homebrew
brew install postgresql
```

### 2. Datenbank erstellen

```sql
CREATE DATABASE adventskalender;
CREATE USER advent_user WITH PASSWORD 'dein_passwort';
GRANT ALL PRIVILEGES ON DATABASE adventskalender TO advent_user;
```

### 3. Migrations ausführen

```bash
psql -U advent_user -d adventskalender -f scripts/001_create_tables.sql
psql -U advent_user -d adventskalender -f scripts/003_multi_tenant_setup.sql
```

### 4. File Storage Alternative

Da PostgreSQL kein eingebautes File Storage hat, brauchst du eine Alternative für Bilder:

**Option A: Lokales Filesystem**
- Speichere Bilder in `public/uploads/`
- Passe `lib/supabase-helpers.ts` an

**Option B: S3-kompatibles Storage**
- AWS S3
- MinIO (selbst gehostet)
- Cloudflare R2

### 5. Code anpassen

Erstelle `lib/db-client.ts`:

```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params)
}
```

Ersetze Supabase-Aufrufe mit direkten SQL-Queries.

## Neon.tech

Neon ist eine serverlose PostgreSQL-Alternative:

1. Erstelle ein Konto auf [neon.tech](https://neon.tech)
2. Erstelle eine Datenbank
3. Kopiere die Connection String
4. Verwende dieselben SQL-Scripts

```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname
```

## Docker-Setup

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: adventskalender
      POSTGRES_USER: advent_user
      POSTGRES_PASSWORD: dein_passwort
    volumes:
      - ./scripts:/docker-entrypoint-initdb.d
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"

volumes:
  postgres_data:
  minio_data:
```

Starte mit: `docker-compose up -d`
