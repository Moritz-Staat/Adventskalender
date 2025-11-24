import type { DrawingState } from "./types"

export function performDraw(state: DrawingState, day: number, winnerId: string): DrawingState {
  const newWinnersByDay = { ...state.winnersByDay, [day]: winnerId }
  let newCycleWinners = [...state.currentCycleWinners, winnerId]

  // Reset cycle if all participants have won
  if (newCycleWinners.length >= state.participants.length) {
    newCycleWinners = []
  }

  return {
    ...state,
    winnersByDay: newWinnersByDay,
    currentCycleWinners: newCycleWinners,
  }
}
