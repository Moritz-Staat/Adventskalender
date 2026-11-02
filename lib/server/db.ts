import { createHash, randomBytes } from "node:crypto"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { openDb } from "./core.mjs"

type Db = ReturnType<typeof openDb>
export interface SessionUser {
  id: string
  name: string
  isAdmin: boolean
}

const COOKIE = "advent_session"
const SESSION_DAYS = 120
const store = globalThis as unknown as { adventDb?: Db }

export function db(): Db {
  return (store.adventDb ??= openDb())
}

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex")

export async function startSession(userId: string) {
  const token = randomBytes(32).toString("base64url")
  const maxAge = SESSION_DAYS * 86400
  db().prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now())
  db()
    .prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
    .run(hashToken(token), userId, Date.now() + maxAge * 1000)
  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  })
}

export async function endSession() {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (token) db().prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(token))
  jar.delete(COOKIE)
}

export async function currentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return null
  const row = db()
    .prepare(
      `SELECT p.id, p.name, p.is_admin FROM sessions s JOIN participants p ON p.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ? AND p.is_active = 1`,
    )
    .get(hashToken(token), Date.now()) as { id: string; name: string; is_admin: number } | undefined
  return row ? { id: row.id, name: row.name, isAdmin: row.is_admin === 1 } : null
}

export const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } })

export const unauthorized = () => json({ error: "Nicht angemeldet" }, 401)

/** Türchen von heute nach deutscher Zeit, 0 außerhalb vom 1.–25. Dezember. */
export function adventDay(): number {
  const override = Number(process.env.ADVENT_TEST_DAY)
  if (override >= 1 && override <= 25) return override
  const [month, date] = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Berlin", month: "numeric", day: "numeric" })
    .format(new Date())
    .split("/")
    .map(Number)
  return month === 12 && date <= 25 ? date : 0
}
