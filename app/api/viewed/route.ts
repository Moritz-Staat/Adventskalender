import { currentUser, db, json, unauthorized } from "@/lib/server/db"

export const dynamic = "force-dynamic"

const validDay = (day: number) => Number.isInteger(day) && day >= 1 && day <= 25

export async function GET(request: Request) {
  const user = await currentUser()
  if (!user) return unauthorized()
  const day = Number(new URL(request.url).searchParams.get("day"))
  if (!validDay(day)) return json({ viewed: false })
  const row = db().prepare("SELECT 1 FROM user_viewed_draws WHERE user_id = ? AND day = ?").get(user.id, day)
  return json({ viewed: row !== undefined })
}

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) return unauthorized()
  const day = Number((await request.json().catch(() => null))?.day)
  if (!validDay(day)) return json({ error: "Ungültiger Tag" }, 400)
  db().prepare("INSERT OR IGNORE INTO user_viewed_draws (user_id, day) VALUES (?, ?)").run(user.id, day)
  return json({ ok: true })
}
