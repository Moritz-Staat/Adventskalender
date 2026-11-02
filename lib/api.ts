import type { DrawingState, Participant } from "./types"
import { setToday } from "./utils"

// Losfarben: jede Person hat ihr eigenes Pastell-Lospapier
const PARTICIPANT_COLORS: Record<string, string> = {
  moritz: "#9fd9c3",
  claudia: "#f4a7b5",
  christian: "#f5d26a",
  ella: "#a9c7f1",
  clara: "#cab4ee",
}

function getColorByIndex(index: number): string {
  const colors = ["#9fd9c3", "#f4a7b5", "#f5d26a", "#a9c7f1", "#cab4ee", "#f6b98a"]
  return colors[index % colors.length]
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error ?? `Anfrage fehlgeschlagen (${response.status})`)
  return body as T
}

const post = <T>(url: string, body?: unknown) =>
  request<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  })

export const getSession = () =>
  request<{ setupComplete: boolean; user: { id: string; name: string; isAdmin: boolean } | null }>("/api/session")

export const login = (name: string, password: string) => post("/api/auth/login", { name, password })

export const logout = () => post("/api/auth/logout")

export async function getDrawingState(): Promise<DrawingState> {
  const state = await request<{
    today: number
    participants: Participant[]
    winnersByDay: Record<number, string>
    imagesByDay: Record<number, string>
    currentCycleWinners: string[]
  }>("/api/state")

  setToday(state.today)

  const savedSettings = localStorage.getItem("userSettings")
  return {
    participants: state.participants.map((p, index) => ({
      ...p,
      color: PARTICIPANT_COLORS[p.id] || getColorByIndex(index),
    })),
    winnersByDay: state.winnersByDay,
    imagesByDay: state.imagesByDay,
    currentCycleWinners: state.currentCycleWinners,
    settings: savedSettings ? JSON.parse(savedSettings) : { soundEnabled: true, confettiEnabled: true },
  }
}

export async function hasUserViewedDraw(day: number): Promise<boolean> {
  return (await request<{ viewed: boolean }>(`/api/viewed?day=${day}`)).viewed
}

export const markDrawAsViewed = (day: number) => post("/api/viewed", { day })

export async function performDraw(): Promise<string> {
  return (await post<{ winnerId: string }>("/api/draw")).winnerId
}

export async function uploadImage(day: number, file: File): Promise<void> {
  const form = new FormData()
  form.set("day", String(day))
  form.set("file", file)
  await request("/api/images", { method: "POST", body: form })
}

export async function getAllImages(): Promise<Array<{ day: number; imageUrl: string; winner: string }>> {
  const state = await getDrawingState()
  return Object.entries(state.imagesByDay).map(([day, imageUrl]) => ({
    day: Number(day),
    imageUrl,
    winner: state.participants.find((p) => p.id === state.winnersByDay[Number(day)])?.name ?? "Unbekannt",
  }))
}
