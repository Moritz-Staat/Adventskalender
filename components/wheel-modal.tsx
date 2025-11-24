"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Participant } from "@/lib/types"
import Confetti from "react-confetti"
import ChristmasLights from "./christmas-lights"
import IntenseSnowfall from "./intense-snowfall"

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
        selectedWinner = participants[0]
      } else {
        selectedWinner = preselected
      }
    } else {
      const winnerIndex = Math.floor(Math.random() * participants.length)
      selectedWinner = participants[winnerIndex]
    }

    const winnerIndex = participants.findIndex((p) => p.id === selectedWinner.id)
    const segmentAngle = 360 / participants.length
    const winnerSegmentCenter = winnerIndex * segmentAngle + segmentAngle / 2
    const spins = 5
    const finalRotation = spins * 360 + (360 - winnerSegmentCenter)

    setRotation(finalRotation)

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
      <DialogContent className="max-w-2xl bg-gradient-to-br from-white/95 to-[#f5e6c8]/90 backdrop-blur-md border-2 border-[#0f3d2e]/20 overflow-hidden">
        <ChristmasLights />

        {isSpinning && <IntenseSnowfall />}

        <div className="relative w-full aspect-square max-w-md mx-auto p-8">
          {showConfetti && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={500}
              gravity={0.3}
              colors={["#0f3d2e", "#b52b3b", "#f5e6c8", "#ffffff", "#ffd700"]}
            />
          )}

          <div className="relative w-full h-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
              <motion.div
                className="relative"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="absolute inset-0 blur-md bg-[#b52b3b] opacity-50" />
                <div className="relative w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-[#b52b3b]" />
              </motion.div>
            </div>

            {isSpinning && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(181,43,59,0.3) 0%, transparent 70%)",
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            )}

            <motion.div
              className="w-full h-full rounded-full overflow-hidden shadow-2xl border-8 border-white relative"
              style={{
                background: `conic-gradient(${participants
                  .map(
                    (p, i) =>
                      `${p.color} ${(i * 360) / participants.length}deg ${((i + 1) * 360) / participants.length}deg`,
                  )
                  .join(", ")})`,
                boxShadow: isSpinning
                  ? "0 0 40px rgba(181, 43, 59, 0.6), 0 0 80px rgba(245, 230, 200, 0.4)"
                  : "0 20px 60px rgba(0,0,0,0.3)",
              }}
              animate={{ rotate: rotation }}
              transition={{
                duration: 4,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {participants.map((participant, index) => {
                const angle = ((360 / participants.length) * index + 360 / participants.length / 2) * (Math.PI / 180)
                const radius = 40
                const x = 50 + radius * Math.cos(angle - Math.PI / 2)
                const y = 50 + radius * Math.sin(angle - Math.PI / 2)

                return (
                  <div
                    key={participant.id}
                    className="absolute text-white font-bold text-lg drop-shadow-lg"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) rotate(${(360 / participants.length) * index}deg)`,
                      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    {participant.name}
                  </div>
                )
              })}

              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg border-4 border-[#0f3d2e] flex items-center justify-center"
                animate={
                  isSpinning
                    ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 0 20px rgba(181, 43, 59, 0.5)",
                          "0 0 30px rgba(181, 43, 59, 0.8)",
                          "0 0 20px rgba(181, 43, 59, 0.5)",
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 0.8,
                  repeat: isSpinning ? Number.POSITIVE_INFINITY : 0,
                }}
              >
                <span className="text-2xl">🎁</span>
              </motion.div>
            </motion.div>
          </div>

          <AnimatePresence>
            {winner && !isSpinning && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0f3d2e]/95 to-[#2d5f4f]/95 rounded-lg backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-[#ffd700] rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                  className="text-center space-y-4 z-10"
                >
                  <motion.div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto shadow-2xl"
                    style={{ backgroundColor: winner.color }}
                    animate={{
                      boxShadow: [`0 0 30px ${winner.color}`, `0 0 50px ${winner.color}`, `0 0 30px ${winner.color}`],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    {winner.name.charAt(0)}
                  </motion.div>
                  <div className="space-y-2">
                    <motion.p
                      className="text-3xl font-bold text-white drop-shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      Heute gewinnt:
                    </motion.p>
                    <motion.p
                      className="text-5xl font-bold text-[#f5e6c8] drop-shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      style={{
                        textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                      }}
                    >
                      {winner.name}
                    </motion.p>
                    <motion.p
                      className="text-lg text-[#f5e6c8]/90 drop-shadow"
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
