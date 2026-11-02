import { readFile } from "node:fs/promises"
import path from "node:path"
import { imageDir } from "@/lib/server/core.mjs"
import { currentUser, unauthorized } from "@/lib/server/db"

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!(await currentUser())) return unauthorized()

  const { name } = await params
  // Nur vom Server vergebene Namen, damit kein Pfad aus dem Bildordner herausführt.
  const match = /^day-\d{1,2}-[0-9a-f]{16}\.([a-z]+)$/.exec(name)
  const type = match && TYPES[match[1]]
  if (!type) return new Response("Nicht gefunden", { status: 404 })

  try {
    const bytes = await readFile(path.join(imageDir(), name))
    return new Response(bytes, {
      headers: {
        "Content-Type": type,
        "X-Content-Type-Options": "nosniff",
        // private: Familienfotos dürfen nicht im Cloudflare-Cache landen.
        "Cache-Control": "private, max-age=86400, immutable",
      },
    })
  } catch {
    return new Response("Nicht gefunden", { status: 404 })
  }
}
