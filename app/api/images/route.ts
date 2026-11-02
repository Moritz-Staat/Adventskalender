import { randomBytes } from "node:crypto"
import { rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { imageDir } from "@/lib/server/core.mjs"
import { currentUser, db, json, unauthorized } from "@/lib/server/db"

const MAX_BYTES = 25 * 1024 * 1024
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
}

export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) return unauthorized()

  const form = await request.formData().catch(() => null)
  const file = form?.get("file")
  const day = Number(form?.get("day"))
  if (!(file instanceof File)) return json({ error: "Keine Datei erhalten" }, 400)

  const ext = EXTENSIONS[file.type]
  if (!ext) return json({ error: "Dieses Bildformat wird nicht unterstützt" }, 415)
  if (file.size > MAX_BYTES) return json({ error: "Das Bild ist größer als 25 MB" }, 413)

  const draw = db().prepare("SELECT winner_id, image_name FROM daily_draws WHERE day = ?").get(day) as
    | { winner_id: string; image_name: string | null }
    | undefined
  if (!draw) return json({ error: "Für diesen Tag gibt es noch keine Auslosung" }, 409)
  if (draw.winner_id !== user.id && !user.isAdmin) return json({ error: "Nicht erlaubt" }, 403)

  const name = `day-${day}-${randomBytes(8).toString("hex")}.${ext}`
  await writeFile(path.join(imageDir(), name), Buffer.from(await file.arrayBuffer()))
  db()
    .prepare("UPDATE daily_draws SET image_name = ?, uploaded_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE day = ?")
    .run(name, day)
  if (draw.image_name) await rm(path.join(imageDir(), draw.image_name), { force: true })

  return json({ imageUrl: `/api/images/${name}` })
}
