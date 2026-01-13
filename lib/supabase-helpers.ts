import { createClient } from "@/lib/supabase/client"
import type { DrawingState, Participant } from "./types"

export interface DailyDraw {
  day: number
  winner_id: string
  drawn_at: string
  image_url: string | null
  uploaded_at: string | null
}

export interface CycleState {
  id: number
  current_cycle: number
  participants_in_cycle: string[]
  updated_at: string
}

const PARTICIPANT_COLORS: Record<string, string> = {
  moritz: "#2d5f4f",
  claudia: "#b52b3b",
  christian: "#d4a574",
  ella: "#8b3a3a",
  clara: "#0f3d2e",
}

// Teilnehmer aus Datenbank holen
export async function getParticipants(): Promise<Participant[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .eq("is_active", true) // Only active participants
    .order("name")

  if (error) throw error

  const storedCredentials = localStorage.getItem("familyCredentials")
  let adminId: string | null = null

  if (storedCredentials) {
    const credentials = JSON.parse(storedCredentials)
    const adminCred = credentials.find((c: any) => c.isAdmin)
    if (adminCred) {
      adminId = adminCred.name.toLowerCase().replace(/\s+/g, "_")
    }
  }

  return data.map((p, index) => ({
    id: p.id,
    name: p.name,
    color: PARTICIPANT_COLORS[p.id] || getColorByIndex(index),
    isAdmin: p.id === adminId,
  }))
}

// Alle Ziehungen holen
export async function getAllDraws(): Promise<DailyDraw[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("daily_draws").select("*").order("day")

  if (error) throw error
  return data || []
}

// Zyklus-Status holen
export async function getCycleState(): Promise<CycleState> {
  const supabase = createClient()
  const { data, error } = await supabase.from("cycle_state").select("*").single()

  if (error) throw error
  return data
}

// Prüfen ob User die Animation für einen Tag gesehen hat
export async function hasUserViewedDraw(userId: string, day: number): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("user_viewed_draws")
    .select("*")
    .eq("user_id", userId)
    .eq("day", day)
    .maybeSingle()

  if (error) throw error
  return data !== null
}

// Markieren dass User die Animation gesehen hat
export async function markDrawAsViewed(userId: string, day: number): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("user_viewed_draws").insert({ user_id: userId, day })

  if (error && !error.message.includes("duplicate")) throw error
}

// Neue Ziehung durchführen
export async function performDraw(day: number): Promise<string> {
  const supabase = createClient()

  // Prüfen ob schon eine Ziehung für diesen Tag existiert
  const { data: existingDraw } = await supabase.from("daily_draws").select("winner_id").eq("day", day).maybeSingle()

  if (existingDraw) {
    return existingDraw.winner_id
  }

  // Teilnehmer und Zyklus-Status holen
  const participants = await getParticipants()
  const cycleState = await getCycleState()

  // Verfügbare Teilnehmer für diesen Zyklus ermitteln
  const availableParticipants = participants.filter((p) => !cycleState.participants_in_cycle.includes(p.id))

  // Zufälligen Gewinner auswählen
  const winner = availableParticipants[Math.floor(Math.random() * availableParticipants.length)]

  // Ziehung speichern
  const { error: drawError } = await supabase.from("daily_draws").insert({ day, winner_id: winner.id })

  if (drawError) throw drawError

  // Zyklus-Status aktualisieren
  const newParticipantsInCycle = [...cycleState.participants_in_cycle, winner.id]
  const isFullCycle = newParticipantsInCycle.length >= participants.length

  const { error: cycleError } = await supabase
    .from("cycle_state")
    .update({
      current_cycle: isFullCycle ? cycleState.current_cycle + 1 : cycleState.current_cycle,
      participants_in_cycle: isFullCycle ? [] : newParticipantsInCycle,
    })
    .eq("id", 1)

  if (cycleError) throw cycleError

  return winner.id
}

// Bild für einen Tag hochladen
export async function uploadDrawImage(day: number, imageUrl: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("daily_draws")
    .update({
      image_url: imageUrl,
      uploaded_at: new Date().toISOString(),
    })
    .eq("day", day)

  if (error) throw error
}

// DrawingState aus Supabase-Daten erstellen (für Kompatibilität)
export async function getDrawingState(): Promise<DrawingState> {
  const [participants, draws] = await Promise.all([getParticipants(), getAllDraws()])

  const winnersByDay: Record<number, string> = {}
  const imagesByDay: Record<number, string> = {}

  draws.forEach((draw) => {
    winnersByDay[draw.day] = draw.winner_id
    if (draw.image_url) {
      imagesByDay[draw.day] = draw.image_url
    }
  })

  const cycleState = await getCycleState()

  const savedSettings = localStorage.getItem("userSettings")
  const settings = savedSettings ? JSON.parse(savedSettings) : { soundEnabled: true, confettiEnabled: true }

  return {
    participants,
    winnersByDay,
    currentCycleWinners: cycleState.participants_in_cycle,
    imagesByDay,
    settings,
  }
}

export async function uploadImageToStorage(day: number, file: File): Promise<string> {
  const supabase = createClient()

  // Eindeutigen Dateinamen erstellen
  const fileExt = file.name.split(".").pop()
  const fileName = `day-${day}-${Date.now()}.${fileExt}`

  // Bild zu Supabase Storage hochladen
  const { data, error } = await supabase.storage.from("advent-images").upload(fileName, file, {
    cacheControl: "3600",
    upsert: true,
  })

  if (error) throw error

  // Öffentliche URL für das Bild holen
  const {
    data: { publicUrl },
  } = supabase.storage.from("advent-images").getPublicUrl(fileName)

  return publicUrl
}

export async function getAllImages(): Promise<Array<{ day: number; imageUrl: string; winner: string }>> {
  const supabase = createClient()
  const { data: draws, error } = await supabase
    .from("daily_draws")
    .select("day, image_url, winner_id")
    .not("image_url", "is", null)
    .order("day")

  if (error) throw error

  const participants = await getParticipants()

  return (draws || []).map((draw) => {
    const winner = participants.find((p) => p.id === draw.winner_id)
    return {
      day: draw.day,
      imageUrl: draw.image_url!,
      winner: winner?.name || "Unknown",
    }
  })
}

export async function checkSetupStatus(): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase.from("app_setup").select("is_setup_complete").eq("id", 1).maybeSingle()

  if (error) {
    console.error("Error checking setup status:", error)
    return false
  }

  return data?.is_setup_complete ?? false
}

function getColorByIndex(index: number): string {
  const colors = ["#0f3d2e", "#b52b3b", "#d4a574", "#8b3a3a", "#2d5f4f", "#7a2d2d"]
  return colors[index % colors.length]
}
