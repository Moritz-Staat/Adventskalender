import { verifyPassword } from "@/lib/server/core.mjs"
import { db, json, startSession } from "@/lib/server/db"

const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILURES = 10
const failures = new Map<string, { count: number; since: number }>()

export async function POST(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "local"
  const entry = failures.get(ip)
  if (entry && Date.now() - entry.since > WINDOW_MS) failures.delete(ip)
  if ((failures.get(ip)?.count ?? 0) >= MAX_FAILURES) {
    return json({ error: "Zu viele Versuche. Bitte warte eine Viertelstunde." }, 429)
  }

  const body = await request.json().catch(() => null)
  const name = typeof body?.name === "string" ? body.name.trim() : ""
  const password = typeof body?.password === "string" ? body.password : ""

  const user = db()
    .prepare("SELECT id, password_hash FROM participants WHERE name = ? AND is_active = 1")
    .get(name) as { id: string; password_hash: string } | undefined

  if (!user || !verifyPassword(password, user.password_hash)) {
    const current = failures.get(ip)
    failures.set(ip, { count: (current?.count ?? 0) + 1, since: current?.since ?? Date.now() })
    return json({ error: "Benutzername oder Passwort falsch" }, 401)
  }

  failures.delete(ip)
  await startSession(user.id)
  return json({ ok: true })
}
