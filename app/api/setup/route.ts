import { hashPassword, participantId } from "@/lib/server/core.mjs"
import { db, json } from "@/lib/server/db"

// Die Seite ist öffentlich erreichbar: wer zuerst käme, würde sonst den Kalender einrichten.
// Eingerichtet wird deshalb über scripts/manage.mjs; das Formular nur mit SETUP_ENABLED=true.
export async function POST(request: Request) {
  if (process.env.SETUP_ENABLED !== "true") return json({ error: "Einrichtung ist deaktiviert" }, 403)

  const { n } = db().prepare("SELECT COUNT(*) AS n FROM participants").get() as { n: number }
  if (n > 0) return json({ error: "Bereits eingerichtet" }, 400)

  const body = await request.json().catch(() => null)
  const members = body?.members
  if (!Array.isArray(members) || members.length < 3 || members.length > 6) {
    return json({ error: "3 bis 6 Mitglieder erforderlich" }, 400)
  }

  const insert = db().prepare("INSERT INTO participants (id, name, password_hash, is_admin) VALUES (?, ?, ?, ?)")
  db().transaction(() => {
    for (const m of members) insert.run(participantId(m.name), m.name.trim(), hashPassword(m.password), m.isAdmin ? 1 : 0)
  })()
  return json({ success: true })
}
