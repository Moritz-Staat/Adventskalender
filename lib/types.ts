export interface Participant {
  id: string
  name: string
  color: string
}

export interface Settings {
  soundEnabled: boolean
  confettiEnabled: boolean
}

export interface DrawingState {
  participants: Participant[]
  winnersByDay: Record<number, string>
  dayImages: Record<number, string>
  currentCycleWinners: string[]
  settings: Settings
}
