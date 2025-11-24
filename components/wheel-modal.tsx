"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Participant } from "@/lib/types"
import Confetti from "react-confetti"

interface WheelModalProps {
  open: boolean
  participants: Participant[]
  onComplete: (winnerId: string) => void
  soundEnabled: boolean
  confettiEnabled: boolean
  preselectedWinnerId?: string
}

export default function WheelModal({
  open,
  participants,
  onComplete,
  soundEnabled,
  confettiEnabled,
  preselectedWinnerId,
}: WheelModalProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState<Participant | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const spinStartedRef = useRef(false)

  useEffect(() => {
    if (open && !spinStartedRef.current && participants.length > 0) {
      spinStartedRef.current = true
      startSpin()
    } else if (!open) {
      spinStartedRef.current = false
      setIsSpinning(false)
      setWinner(null)
      setRotation(0)
      setShowConfetti(false)
    }
  }, [open, participants, preselectedWinnerId])

  const startSpin = () => {
    setIsSpinning(true)

    let selectedWinner: Participant
    if (preselectedWinnerId) {
      const preselected = participants.find((p) => p.id === preselectedWinnerId)
      if (!preselected) {
        // Fallback if preselected not in list
        selectedWinner = participants[0]
      } else {
        selectedWinner = preselected
      }
    } else {
      const winnerIndex = Math.floor(Math.random() * participants.length)
      selectedWinner = participants[winnerIndex]
    }

    // Calculate rotation to land on winner
    const winnerIndex = participants.findIndex((p) => p.id === selectedWinner.id)
    const segmentAngle = 360 / participants.length
    const targetAngle = winnerIndex * segmentAngle
    const spins = 5 // Number of full rotations
    const finalRotation = spins * 360 + (360 - targetAngle) + segmentAngle / 2

    setRotation(finalRotation)

    // After animation, show winner
    setTimeout(() => {
      setIsSpinning(false)
      setWinner(selectedWinner)
      if (confettiEnabled) {
        setShowConfetti(true)
      }
      onComplete(selectedWinner.id)
    }, 4000)
  }

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-md border-2 border-[#0f3d2e]/20">
        <div className="relative w-full aspect-square max-w-md mx-auto p-8">
          {showConfetti && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={500}
              gravity={0.3}
            />
          )}

          {/* Wheel Container */}
          <div className="relative w-full h-full">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
              <motion.div
                className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-[#b52b3b]"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>

            {/* Wheel */}
            <motion.div
              className="w-full h-full rounded-full overflow-hidden shadow-2xl border-8 border-white relative"
              style={{
                background: `conic-gradient(${participants
                  .map(
                    (p, i) =>
                      `${p.color} ${(i * 360) / participants.length}deg ${((i + 1) * 360) / participants.length}deg`,
                  )
                  .join(", ")})`,
              }}
              animate={{ rotate: rotation }}
              transition={{
                duration: 4,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {/* Participant Names on Wheel */}
              {participants.map((participant, index) => {
                const angle = ((360 / participants.length) * index + 360 / participants.length / 2) * (Math.PI / 180)
                const radius = 40 // percentage from center
                const x = 50 + radius * Math.cos(angle - Math.PI / 2)
                const y = 50 + radius * Math.sin(angle - Math.PI / 2)

                return (
                  <div
                    key={participant.id}
                    className="absolute text-white font-bold text-lg"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) rotate(${(360 / participants.length) * index}deg)`,
                    }}
                  >
                    {participant.name}
                  </div>
                )
              })}

              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg border-4 border-[#0f3d2e] flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
            </motion.div>
          </div>

          {/* Winner Announcement */}
          <AnimatePresence>
            {winner && !isSpinning && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0f3d2e]/95 to-[#2d5f4f]/95 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                  className="text-center space-y-4"
                >
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto shadow-2xl"
                    style={{ backgroundColor: winner.color }}
                  >
                    {winner.name.charAt(0)}
                  </div>
                  <div className="space-y-2">
                    <motion.p
                      className="text-3xl font-bold text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      Heute gewinnt:
                    </motion.p>
                    <motion.p
                      className="text-5xl font-bold text-[#f5e6c8]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      {winner.name}
                    </motion.p>
                    <motion.p
                      className="text-lg text-[#f5e6c8]/90"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      Du darfst das Adventstürchen öffnen!
                    </motion.p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
