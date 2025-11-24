"use client"

import { useState, useEffect } from "react"
import LoginPage from "@/components/login-page"
import Dashboard from "@/components/dashboard"
import WheelModal from "@/components/wheel-modal"
import type { Participant, DrawingState } from "@/lib/types"
import { performDraw } from "@/lib/draw-logic"
import { getCurrentDay } from "@/lib/utils"

export default function Home() {
  const [currentUser, setCurrentUser] = useState<Participant | null>(null)
  const [drawingState, setDrawingState] = useState<DrawingState | null>(null)
  const [showLoginAnimation, setShowLoginAnimation] = useState(false)
  const [pendingWinner, setPendingWinner] = useState<string | null>(null)

  useEffect(() => {
    // Load state from localStorage
    const savedUser = localStorage.getItem("currentUser")
    const savedState = localStorage.getItem("drawingState")

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }

    if (savedState) {
      setDrawingState(JSON.parse(savedState))
    } else {
      const defaultState: DrawingState = {
        participants: [
          { id: "1", name: "Moritz", color: "#2d5f4f" },
          { id: "2", name: "Claudia", color: "#b52b3b" },
          { id: "3", name: "Christian", color: "#d4a574" },
          { id: "4", name: "Ella", color: "#8b3a3a" },
          { id: "5", name: "Clara", color: "#0f3d2e" },
        ],
        winnersByDay: {},
        currentCycleWinners: [],
        settings: {
          soundEnabled: true,
          confettiEnabled: true,
        },
      }
      setDrawingState(defaultState)
      localStorage.setItem("drawingState", JSON.stringify(defaultState))
    }
  }, [])

  const hasSeenTodayAnimation = (userId: string, day: number): boolean => {
    const key = `animation_seen_${userId}_${day}`
    return localStorage.getItem(key) === "true"
  }

  const markAnimationSeen = (userId: string, day: number) => {
    const key = `animation_seen_${userId}_${day}`
    localStorage.setItem(key, "true")
  }

  const handleLogin = (user: Participant) => {
    setCurrentUser(user)
    localStorage.setItem("currentUser", JSON.stringify(user))

    if (drawingState) {
      const currentDay = getCurrentDay()
      const todayWinner = drawingState.winnersByDay[currentDay]

      if (todayWinner && !hasSeenTodayAnimation(user.id, currentDay)) {
        // Show animation with existing winner
        setPendingWinner(todayWinner)
        setShowLoginAnimation(true)
      }
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
  }

  const updateDrawingState = (newState: DrawingState) => {
    setDrawingState(newState)
    localStorage.setItem("drawingState", JSON.stringify(newState))
  }

  const handleLoginAnimationComplete = () => {
    if (currentUser && pendingWinner) {
      const currentDay = getCurrentDay()
      markAnimationSeen(currentUser.id, currentDay)
    }
    setShowLoginAnimation(false)
    setPendingWinner(null)
  }

  const handleNewDraw = (winnerId: string) => {
    if (!drawingState || !currentUser) return

    const currentDay = getCurrentDay()
    const newState = performDraw(drawingState, currentDay, winnerId)
    updateDrawingState(newState)

    // Mark as seen for current user
    markAnimationSeen(currentUser.id, currentDay)
  }

  if (!currentUser || !drawingState) {
    return <LoginPage onLogin={handleLogin} drawingState={drawingState} />
  }

  return (
    <>
      <Dashboard
        currentUser={currentUser}
        drawingState={drawingState}
        onLogout={handleLogout}
        onUpdateState={updateDrawingState}
        onNewDraw={handleNewDraw}
      />

      {showLoginAnimation && pendingWinner && (
        <WheelModal
          open={showLoginAnimation}
          participants={drawingState.participants}
          onComplete={handleLoginAnimationComplete}
          soundEnabled={drawingState.settings.soundEnabled}
          confettiEnabled={drawingState.settings.confettiEnabled}
          preselectedWinnerId={pendingWinner}
        />
      )}
    </>
  )
}
