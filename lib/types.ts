export interface Participant {
  id: string
  name: string
  color?: string // Optional since colors are UI-only, not stored in DB
  isAdmin?: boolean // Added isAdmin flag for admin privileges
}

export interface Settings {
  soundEnabled: boolean
  confettiEnabled: boolean
}

export interface DrawingState {
  participants: Participant[]
  winnersByDay: Record<number, string>
  imagesByDay: Record<number, string> // Renamed from dayImages for consistency
  currentCycleWinners: string[]
  settings?: Settings // Optional since settings are stored locally
}
