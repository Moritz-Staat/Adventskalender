"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { TrendingUp, Users } from "lucide-react"
import type { Participant } from "@/lib/types"

interface StatsPanelProps {
  participants: Participant[]
  winnersByDay: Record<number, string>
  currentCycleWinners: string[]
}

export default function StatsPanel({ participants, winnersByDay, currentCycleWinners }: StatsPanelProps) {
  // Count wins per participant
  const winCounts = participants.map((participant) => {
    const wins = Object.values(winnersByDay).filter((id) => id === participant.id).length
    return { participant, wins }
  })

  // Sort by wins
  winCounts.sort((a, b) => b.wins - a.wins)

  // Get eligible participants for current cycle
  const eligibleParticipants = participants.filter((p) => !currentCycleWinners.includes(p.id))

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-[#0f3d2e]/10">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#0f3d2e]" />
          <h2 className="text-xl font-bold text-[#0f3d2e]">Statistik</h2>
        </div>

        {/* Win Counts */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[#0f3d2e]/70">Anzahl Gewinne:</h3>
          {winCounts.map(({ participant, wins }, index) => (
            <motion.div
              key={participant.id}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: participant.color }}
              >
                {participant.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#0f3d2e]">{participant.name}</span>
                  <span className="text-sm font-bold text-[#0f3d2e]">{wins}×</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: participant.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(wins / 5) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Current Cycle Status */}
        <div className="pt-4 border-t border-[#0f3d2e]/10">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-[#0f3d2e]" />
            <h3 className="text-sm font-medium text-[#0f3d2e]/70">Aktueller Zyklus:</h3>
          </div>
          {eligibleParticipants.length > 0 ? (
            <div>
              <p className="text-sm text-[#0f3d2e] mb-2">Noch nicht dran in diesem Zyklus:</p>
              <div className="flex flex-wrap gap-2">
                {eligibleParticipants.map((participant) => (
                  <motion.div
                    key={participant.id}
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: participant.color }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {participant.name}
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#0f3d2e]">Alle haben in diesem Zyklus gewonnen! 🎉</p>
          )}
        </div>
      </div>
    </Card>
  )
}
