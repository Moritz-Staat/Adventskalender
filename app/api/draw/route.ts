import { randomInt } from "node:crypto"
import { adventDay, currentUser, db, json, unauthorized } from "@/lib/server/db"

export async function POST() {
  const user = await currentUser()
  if (!user) return unauthorized()

  const day = adventDay()
  if (day === 0) return json({ error: "Heute ist kein Adventstag" }, 409)

  // Transaktion, damit zwei gleichzeitige Klicks nicht zwei Gewinner erzeugen.
  const winnerId = db().transaction(() => {
    const existing = db().prepare("SELECT winner_id FROM daily_draws WHERE day = ?").get(day) as
      | { winner_id: string }
      | undefined
    if (existing) return existing.winner_id

    const all = (db().prepare("SELECT id FROM participants WHERE is_active = 1").all() as { id: string }[]).map(
      (p) => p.id,
    )
    const cycle = db().prepare("SELECT current_cycle, participants_in_cycle FROM cycle_state WHERE id = 1").get() as {
      current_cycle: number
      participants_in_cycle: string
    }
    const drawn: string[] = JSON.parse(cycle.participants_in_cycle)
    const pot = all.filter((id) => !drawn.includes(id))
    const winner = pot[randomInt(pot.length)]

    db().prepare("INSERT INTO daily_draws (day, winner_id) VALUES (?, ?)").run(day, winner)

    const next = [...drawn, winner]
    const cycleDone = next.length >= all.length
    db()
      .prepare("UPDATE cycle_state SET current_cycle = ?, participants_in_cycle = ? WHERE id = 1")
      .run(cycle.current_cycle + (cycleDone ? 1 : 0), JSON.stringify(cycleDone ? [] : next))
    return winner
  })()

  return json({ winnerId })
}
