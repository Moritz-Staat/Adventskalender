"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import WheelModal from "@/components/wheel-modal"
import type { DrawingState } from "@/lib/types"

interface DrawPanelProps {
  currentDay: number
  drawingState: DrawingState
  onUpdateState: (state: DrawingState) => void
  onNewDraw: (winnerId: string) => void
}

export default function DrawPanel({ currentDay, drawingState, onUpdateState, onNewDraw }: DrawPanelProps) {
  const [showWheel, setShowWheel] = useState(false)
  const hasDrawnToday = drawingState.winnersByDay[currentDay] !== undefined
  const eligibleParticipants = drawingState.participants.filter((p) => !drawingState.currentCycleWinners.includes(p.id))

  const handleDraw = () => {
    if (hasDrawnToday || currentDay < 1 || currentDay > 25) return
    setShowWheel(true)
  }

  const handleDrawComplete = (winnerId: string) => {
    onNewDraw(winnerId)
    setTimeout(() => setShowWheel(false), 3000)
  }

  const todayWinner = hasDrawnToday
    ? drawingState.participants.find((p) => p.id === drawingState.winnersByDay[currentDay])
    : null

  return (
    <>
      <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-[#0f3d2e]/10">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0f3d2e]">Türchen {currentDay}</h2>
            <p className="text-[#0f3d2e]/70 mt-1">
              {hasDrawnToday ? "Heute wurde bereits ausgelost" : "Wer darf heute öffnen?"}
            </p>
          </div>

          {/* Participants Status */}
          <div>
            <h3 className="text-sm font-medium text-[#0f3d2e] mb-3">Teilnehmer:</h3>
            <div className="flex flex-wrap gap-3">
              {drawingState.participants.map((participant) => {
                const isEligible = !drawingState.currentCycleWinners.includes(participant.id)
                const isWinner = todayWinner?.id === participant.id

                return (
                  <motion.div
                    key={participant.id}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                      isWinner
                        ? "bg-gradient-to-br from-[#b52b3b] to-[#8b3a3a] ring-2 ring-[#b52b3b]"
                        : isEligible
                          ? "bg-[#f5e6c8]/50"
                          : "bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        !isEligible && !isWinner ? "opacity-50" : ""
                      }`}
                      style={{ backgroundColor: participant.color }}
                    >
                      {participant.name.charAt(0)}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isWinner ? "text-white" : isEligible ? "text-[#0f3d2e]" : "text-gray-500"
                      }`}
                    >
                      {participant.name}
                    </span>
                    {!isEligible && !isWinner && <span className="text-xs text-gray-500">Pause</span>}
                    {isWinner && (
                      <motion.span
                        className="text-xs text-white font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        Gewinner!
                      </motion.span>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Draw Button */}
          <AnimatePresence mode="wait">
            {hasDrawnToday ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center p-6 bg-gradient-to-br from-[#0f3d2e] to-[#2d5f4f] rounded-lg"
              >
                <p className="text-white text-lg font-bold">Heute gewinnt: {todayWinner?.name}</p>
                <p className="text-[#f5e6c8] text-sm mt-2">Du darfst das Adventstürchen öffnen!</p>
              </motion.div>
            ) : currentDay >= 1 && currentDay <= 25 ? (
              <motion.div
                key="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Button
                  onClick={handleDraw}
                  className="w-full bg-gradient-to-r from-[#b52b3b] to-[#8b3a3a] hover:from-[#8b3a3a] hover:to-[#b52b3b] text-white text-lg py-6 transition-all duration-300"
                  size="lg"
                >
                  Jetzt auslosen
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="invalid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center p-6 bg-gray-100 rounded-lg"
              >
                <p className="text-gray-600">Heute ist kein gültiger Adventstag</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <WheelModal
        open={showWheel}
        participants={eligibleParticipants}
        onComplete={handleDrawComplete}
        soundEnabled={drawingState.settings.soundEnabled}
        confettiEnabled={drawingState.settings.confettiEnabled}
      />
    </>
  )
}
