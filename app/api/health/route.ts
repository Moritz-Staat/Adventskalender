import { db, json } from "@/lib/server/db"

export const dynamic = "force-dynamic"

export function GET() {
  db().prepare("SELECT 1").get()
  return json({ ok: true })
}
