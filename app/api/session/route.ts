import { currentUser, db, json } from "@/lib/server/db"

export const dynamic = "force-dynamic"

export async function GET() {
  const { n } = db().prepare("SELECT COUNT(*) AS n FROM participants WHERE is_active = 1").get() as { n: number }
  return json({ setupComplete: n > 0, user: await currentUser() })
}
