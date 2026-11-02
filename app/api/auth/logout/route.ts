import { endSession, json } from "@/lib/server/db"

export async function POST() {
  await endSession()
  return json({ ok: true })
}
