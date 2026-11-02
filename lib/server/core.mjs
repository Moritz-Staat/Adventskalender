// Von den Route-Handlern und von scripts/manage.mjs gemeinsam genutzt, darum reines ESM ohne Next-Abhängigkeit.
import Database from "better-sqlite3"
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"
import { mkdirSync } from "node:fs"
import path from "node:path"

export const dataDir = () => process.env.DATA_DIR || path.join(process.cwd(), "data")
export const imageDir = () => path.join(dataDir(), "images")

const SCHEMA = `
CREATE TABLE IF NOT EXISTS participants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  is_admin INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS daily_draws (
  day INTEGER PRIMARY KEY CHECK (day BETWEEN 1 AND 25),
  winner_id TEXT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  drawn_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  image_name TEXT,
  uploaded_at TEXT
);
CREATE TABLE IF NOT EXISTS user_viewed_draws (
  user_id TEXT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  day INTEGER NOT NULL CHECK (day BETWEEN 1 AND 25),
  viewed_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (user_id, day)
);
CREATE TABLE IF NOT EXISTS cycle_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  current_cycle INTEGER NOT NULL DEFAULT 1,
  participants_in_cycle TEXT NOT NULL DEFAULT '[]'
);
INSERT OR IGNORE INTO cycle_state (id) VALUES (1);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
`

export function openDb() {
  mkdirSync(imageDir(), { recursive: true })
  const db = new Database(path.join(dataDir(), "advent.db"))
  db.pragma("journal_mode = WAL")
  db.pragma("foreign_keys = ON")
  db.pragma("busy_timeout = 5000")
  db.exec(SCHEMA)
  return db
}

export function hashPassword(password) {
  const salt = randomBytes(16)
  return `${salt.toString("hex")}:${scryptSync(password, salt, 64).toString("hex")}`
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":")
  const expected = Buffer.from(hash, "hex")
  return timingSafeEqual(scryptSync(password, Buffer.from(salt, "hex"), expected.length), expected)
}

export const participantId = (name) => name.trim().toLowerCase().replace(/\s+/g, "_")
