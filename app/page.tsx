"use client"

import { useState, useEffect } from "react"
import LoginPage from "@/components/login-page"
import SetupPage from "@/components/setup-page"
import Dashboard from "@/components/dashboard"
import WheelModal from "@/components/wheel-modal"
import { Awning, BulbRow, TreeMark } from "@/components/booth"
import type { Participant, DrawingState } from "@/lib/types"
import { getCurrentDay } from "@/lib/utils"
import { toast } from "sonner"
import {
  getDrawingState,
  getSession,
  hasUserViewedDraw,
  login,
  logout,
  markDrawAsViewed,
  performDraw,
  uploadImage,
} from "@/lib/api"

export default function Home() {
  const [currentUser, setCurrentUser] = useState<Participant | null>(null)
  const [drawingState, setDrawingState] = useState<DrawingState | null>(null)
  const [showLoginAnimation, setShowLoginAnimation] = useState(false)
  const [pendingWinner, setPendingWinner] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  // Holt den Stand nach dem Anmelden und spielt das Rad ab, falls heute schon gelost wurde
  const enterAs = async (userId: string) => {
    const state = await getDrawingState()
    const user = state.participants.find((p) => p.id === userId)
    setDrawingState(state)
    setCurrentUser(user ?? null)
    if (!user) return

    const currentDay = getCurrentDay()
    const todayWinner = state.winnersByDay[currentDay]
    if (todayWinner && !(await hasUserViewedDraw(currentDay))) {
      setPendingWinner(todayWinner)
      setShowLoginAnimation(true)
    }
  }

  const loadData = async () => {
    try {
      setIsLoading(true)
      const session = await getSession()
      setIsSetupComplete(session.setupComplete)
      if (session.user) await enterAs(session.user.id)
    } catch (error) {
      console.error("[v0] Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (name: string, password: string) => {
    await login(name, password)
    const session = await getSession()
    if (session.user) await enterAs(session.user.id)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setDrawingState(null)
    logout().catch((error) => console.error("[v0] Error logging out:", error))
  }

  const reloadDrawingState = async () => {
    try {
      const state = await getDrawingState()
      setDrawingState(state)
    } catch (error) {
      console.error("[v0] Error reloading drawing state:", error)
    }
  }

  const handleLoginAnimationComplete = async () => {
    if (currentUser && pendingWinner) {
      await markDrawAsViewed(getCurrentDay())
    }
  }

  const handleLoginAnimationDismiss = () => {
    setShowLoginAnimation(false)
    setPendingWinner(null)
  }

  // Erst in der Datenbank auslosen, dann dreht das Rad genau zu diesem Gewinner
  const handlePerformDraw = () => performDraw()

  const handleDrawRevealed = async () => {
    if (!currentUser) return
    await markDrawAsViewed(getCurrentDay())
    await reloadDrawingState()
  }

  const handleImageUpload = async (day: number, file: File) => {
    try {
      await uploadImage(day, file)
      await reloadDrawingState()
    } catch (error) {
      console.error("[v0] Error uploading image:", error)
      toast.error(error instanceof Error ? error.message : "Das Foto konnte nicht hochgeladen werden.")
    }
  }

  const handleSetupComplete = async () => {
    await loadData()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Awning />
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 pb-24" role="status">
          <TreeMark className="h-14 w-14 text-[#2f6b4f]" />
          <BulbRow count={7} className="w-40" />
          <p className="font-semibold text-cream-dim">Die Bude öffnet …</p>
        </div>
      </div>
    )
  }

  if (isSetupComplete === false) {
    return <SetupPage onSetupComplete={handleSetupComplete} />
  }

  if (!currentUser || !drawingState) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <>
      <Dashboard
        currentUser={currentUser}
        drawingState={drawingState}
        onLogout={handleLogout}
        onUpdateState={reloadDrawingState}
        onPerformDraw={handlePerformDraw}
        onDrawRevealed={handleDrawRevealed}
        onImageUpload={handleImageUpload}
      />

      {showLoginAnimation && pendingWinner && (
        <WheelModal
          open={showLoginAnimation}
          participants={drawingState.participants}
          onComplete={handleLoginAnimationComplete}
          onDismiss={handleLoginAnimationDismiss}
          day={getCurrentDay()}
          soundEnabled={drawingState.settings?.soundEnabled ?? true}
          confettiEnabled={drawingState.settings?.confettiEnabled ?? true}
          preselectedWinnerId={pendingWinner}
        />
      )}
    </>
  )
}
