import { adventDay, currentUser, db, json, unauthorized } from "@/lib/server/db"

export const dynamic = "force-dynamic"

export async function GET() {
  const user = await currentUser()
  if (!user) return unauthorized()

  const participants = db()
    .prepare("SELECT id, name, is_admin FROM participants WHERE is_active = 1 ORDER BY name")
    .all() as { id: string; name: string; is_admin: number }[]
  const draws = db().prepare("SELECT day, winner_id, image_name FROM daily_draws ORDER BY day").all() as {
    day: number
    winner_id: string
    image_name: string | null
  }[]
  const cycle = db().prepare("SELECT participants_in_cycle FROM cycle_state WHERE id = 1").get() as {
    participants_in_cycle: string
  }

  return json({
    today: adventDay(),
    participants: participants.map((p) => ({ id: p.id, name: p.name, isAdmin: p.is_admin === 1 })),
    winnersByDay: Object.fromEntries(draws.map((d) => [d.day, d.winner_id])),
    imagesByDay: Object.fromEntries(
      draws.filter((d) => d.image_name).map((d) => [d.day, `/api/images/${d.image_name}`]),
    ),
    currentCycleWinners: JSON.parse(cycle.participants_in_cycle),
  })
}
