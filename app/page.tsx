"use client"

import { useState, useEffect } from "react"
import LoginPage from "@/components/login-page"
import SetupPage from "@/components/setup-page"
import Dashboard from "@/components/dashboard"
import WheelModal from "@/components/wheel-modal"
import { Awning, BulbRow, TreeMark } from "@/components/booth"
import type { Participant, DrawingState } from "@/lib/types"
import { getCurrentDay } from "@/lib/utils"
import {
  getDrawingState,
  hasUserViewedDraw,
  markDrawAsViewed,
  performDraw as performSupabaseDraw,
  uploadDrawImage,
  uploadImageToStorage,
  checkSetupStatus,
} from "@/lib/supabase-helpers"

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

  const loadData = async () => {
    try {
      setIsLoading(true)
      const setupComplete = await checkSetupStatus()
      setIsSetupComplete(setupComplete)

      if (!setupComplete) {
        setIsLoading(false)
        return
      }

      const state = await getDrawingState()
      setDrawingState(state)

      const savedUser = localStorage.getItem("currentUser")
      if (savedUser) {
        const savedUserData = JSON.parse(savedUser)
        const updatedUser = state.participants.find((p) => p.id === savedUserData.id)
        if (updatedUser) {
          setCurrentUser(updatedUser)
          localStorage.setItem("currentUser", JSON.stringify(updatedUser))

          const currentDay = getCurrentDay()
          const todayWinner = state.winnersByDay[currentDay]

          if (todayWinner) {
            const hasViewed = await hasUserViewedDraw(updatedUser.id, currentDay)
            if (!hasViewed) {
              setPendingWinner(todayWinner)
              setShowLoginAnimation(true)
            }
          }
        }
      }
    } catch (error) {
      console.error("[v0] Error loading data from Supabase:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (user: Participant) => {
    setCurrentUser(user)
    localStorage.setItem("currentUser", JSON.stringify(user))

    if (drawingState) {
      const currentDay = getCurrentDay()
      const todayWinner = drawingState.winnersByDay[currentDay]

      if (todayWinner) {
        const hasViewed = await hasUserViewedDraw(user.id, currentDay)
        if (!hasViewed) {
          setPendingWinner(todayWinner)
          setShowLoginAnimation(true)
        }
      }
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
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
      const currentDay = getCurrentDay()
      await markDrawAsViewed(currentUser.id, currentDay)
    }
  }

  const handleLoginAnimationDismiss = () => {
    setShowLoginAnimation(false)
    setPendingWinner(null)
  }

  // Erst in der Datenbank auslosen, dann dreht das Rad genau zu diesem Gewinner
  const handlePerformDraw = async () => {
    return performSupabaseDraw(getCurrentDay())
  }

  const handleDrawRevealed = async () => {
    if (!currentUser) return
    await markDrawAsViewed(currentUser.id, getCurrentDay())
    await reloadDrawingState()
  }

  const handleImageUpload = async (day: number, file: File) => {
    try {
      const imageUrl = await uploadImageToStorage(day, file)
      await uploadDrawImage(day, imageUrl)
      await reloadDrawingState()
    } catch (error) {
      console.error("[v0] Error uploading image:", error)
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
    return <LoginPage onLogin={handleLogin} drawingState={drawingState} />
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
