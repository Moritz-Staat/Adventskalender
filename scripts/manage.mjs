#!/usr/bin/env node
// Verwaltung im Container: docker compose exec adventskalender node scripts/manage.mjs <befehl>
//   setup <Admin> <Name> <Name> ...   legt die Familie an (erster Name = Admin), druckt die Passwörter einmal aus
//   password <Name>                   vergibt ein neues Passwort und meldet die Person überall ab
//   new-season                        leert Ziehungen und Lostopf für ein neues Jahr; Fotos bleiben im Bildordner
import { randomInt } from "node:crypto"
import { hashPassword, openDb, participantId } from "../lib/server/core.mjs"

// 12 Zeichen aus 31 ergeben rund 59 Bit; ohne 0/o und 1/l/i, damit man sie vom Zettel abtippen kann.
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"
const group = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("")
const newPassword = () => `${group()}-${group()}-${group()}`
const fail = (message) => {
  console.error(message)
  process.exit(1)
}

const [command, ...args] = process.argv.slice(2)
const db = openDb()

if (command === "setup") {
  if (args.length < 3 || args.length > 6) fail("Es braucht 3 bis 6 Namen.")
  if (db.prepare("SELECT COUNT(*) AS n FROM participants").get().n > 0) fail("Es sind schon Teilnehmende angelegt.")
  const insert = db.prepare("INSERT INTO participants (id, name, password_hash, is_admin) VALUES (?, ?, ?, ?)")
  db.transaction(() => {
    args.forEach((name, index) => {
      const password = newPassword()
      insert.run(participantId(name), name, hashPassword(password), index === 0 ? 1 : 0)
      console.log(`${name}: ${password}`)
    })
  })()
} else if (command === "password") {
  const user = db.prepare("SELECT id, name FROM participants WHERE name = ?").get(args[0] ?? "")
  if (!user) fail(`Niemand heißt ${args[0]}.`)
  const password = newPassword()
  db.transaction(() => {
    db.prepare("UPDATE participants SET password_hash = ? WHERE id = ?").run(hashPassword(password), user.id)
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id)
  })()
  console.log(`${user.name}: ${password}`)
} else if (command === "new-season") {
  db.transaction(() => {
    db.exec("DELETE FROM user_viewed_draws; DELETE FROM daily_draws;")
    db.prepare("UPDATE cycle_state SET current_cycle = 1, participants_in_cycle = '[]' WHERE id = 1").run()
  })()
  console.log("Neue Saison: Ziehungen und Lostopf sind leer.")
} else {
  fail("Befehle: setup <Admin> <Name> ... | password <Name> | new-season")
}
