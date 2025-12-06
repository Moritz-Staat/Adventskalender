"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import CalendarGrid from "@/components/calendar-grid"
import DrawPanel from "@/components/draw-panel"
import HistoryPanel from "@/components/history-panel"
import StatsPanel from "@/components/stats-panel"
import SettingsDialog from "@/components/settings-dialog"
import Snowfall from "@/components/snowfall"
import ImageUploadModal from "@/components/image-upload-modal"
import { ImageViewerModal } from "@/components/image-viewer-modal"
import type { Participant, DrawingState } from "@/lib/types"
import { getCurrentDay, getMonthName } from "@/lib/utils"

interface DashboardProps {
  currentUser: Participant
  drawingState: DrawingState
  onLogout: () => void
  onUpdateState: () => void // Changed to reload function
  onNewDraw: (winnerId: string) => void
  onImageUpload: (day: number, file: File) => Promise<void> // Added image upload prop
}

export default function Dashboard({
  currentUser,
  drawingState,
  onLogout,
  onUpdateState,
  onNewDraw,
  onImageUpload,
}: DashboardProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [uploadDay, setUploadDay] = useState<number | null>(null)
  const [viewerState, setViewerState] = useState<{ isOpen: boolean; day: number; imageUrl: string; winner: string }>({
    isOpen: false,
    day: 0,
    imageUrl: "",
    winner: "",
  })
  const currentDay = getCurrentDay()
  const today = new Date()

  const todayWinner = drawingState.winnersByDay[currentDay]
  const needsImageUpload = todayWinner === currentUser.id && !drawingState.imagesByDay[currentDay]

  const handleImageUploadPrompt = () => {
    if (needsImageUpload) {
      setUploadDay(currentDay)
      setShowImageUpload(true)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (uploadDay) {
      await onImageUpload(uploadDay, file)
      setShowImageUpload(false)
      setUploadDay(null)
    }
  }

  const handleImageView = (day: number) => {
    const imageUrl = drawingState.imagesByDay[day]
    const winnerId = drawingState.winnersByDay[day]
    const winner = drawingState.participants.find((p) => p.id === winnerId)

    if (imageUrl && winner) {
      setViewerState({
        isOpen: true,
        day,
        imageUrl,
        winner: winner.name,
      })
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f5e6c8] via-white to-[#f5e6c8]">
      <Snowfall />

      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#0f3d2e]/10 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0f3d2e] to-[#2d5f4f] rounded-full flex items-center justify-center">
                <span className="text-xl">🎄</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[#0f3d2e]">Familien-Adventskalender</h1>
                <p className="text-sm text-[#0f3d2e]/70">
                  Heute ist der {today.getDate()}. {getMonthName(today.getMonth())}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-[#0f3d2e]/5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: currentUser.color }}
                  >
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-[#0f3d2e] font-medium">{currentUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowSettings(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Einstellungen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout} className="text-[#b52b3b]">
                  <LogOut className="w-4 h-4 mr-2" />
                  Abmelden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Calendar Grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CalendarGrid
              currentDay={currentDay}
              winnersByDay={drawingState.winnersByDay}
              dayImages={drawingState.imagesByDay}
              participants={drawingState.participants}
              onDayClick={setSelectedDay}
              onImageClick={handleImageView}
            />
          </motion.div>

          {/* Right: Draw Panel and Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <DrawPanel
                currentDay={currentDay}
                currentUser={currentUser}
                drawingState={drawingState}
                onUpdateState={onUpdateState}
                onNewDraw={onNewDraw}
                onRequestImageUpload={handleImageUploadPrompt}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <StatsPanel
                participants={drawingState.participants}
                winnersByDay={drawingState.winnersByDay}
                currentCycleWinners={drawingState.currentCycleWinners}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <HistoryPanel
                winnersByDay={drawingState.winnersByDay}
                participants={drawingState.participants}
                selectedDay={selectedDay}
              />
            </motion.div>
          </div>
        </div>
      </main>

      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={drawingState.settings || { soundEnabled: true, confettiEnabled: true }}
        onUpdateSettings={(settings) => {
          // Settings are stored locally in localStorage
          localStorage.setItem("userSettings", JSON.stringify(settings))
        }}
      />

      <ImageUploadModal
        open={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onUpload={handleImageUpload}
        winnerName={currentUser.name}
        day={uploadDay || currentDay}
      />

      <ImageViewerModal
        isOpen={viewerState.isOpen}
        onClose={() => setViewerState({ ...viewerState, isOpen: false })}
        imageUrl={viewerState.imageUrl}
        day={viewerState.day}
        winner={viewerState.winner}
      />
    </div>
  )
}
