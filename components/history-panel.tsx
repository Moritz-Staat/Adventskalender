"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { History, Calendar } from "lucide-react"
import type { Participant } from "@/lib/types"

interface HistoryPanelProps {
  winnersByDay: Record<number, string>
  participants: Participant[]
  selectedDay: number | null
}

export default function HistoryPanel({ winnersByDay, participants, selectedDay }: HistoryPanelProps) {
  const historyEntries = Object.entries(winnersByDay)
    .map(([day, winnerId]) => ({
      day: Number.parseInt(day),
      winner: participants.find((p) => p.id === winnerId),
    }))
    .sort((a, b) => b.day - a.day)
    .slice(0, 10) // Show last 10 entries

  const getMonthName = () => "Dezember"

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-[#0f3d2e]/10">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#0f3d2e]" />
          <h2 className="text-xl font-bold text-[#0f3d2e]">Verlauf</h2>
        </div>

        {historyEntries.length === 0 ? (
          <p className="text-sm text-[#0f3d2e]/70 text-center py-8">Noch keine Auslosungen</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {historyEntries.map(({ day, winner }, index) => {
              if (!winner) return null

              const isSelected = selectedDay === day
              const isCycleStart = (day - 1) % 5 === 0 && day > 1

              return (
                <div key={day}>
                  {isCycleStart && (
                    <div className="flex items-center gap-2 my-4">
                      <div className="flex-1 h-px bg-[#0f3d2e]/20" />
                      <span className="text-xs text-[#0f3d2e]/50 font-medium">Neuer Zyklus ab Tag {day}</span>
                      <div className="flex-1 h-px bg-[#0f3d2e]/20" />
                    </div>
                  )}

                  <motion.div
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isSelected ? "bg-[#f5e6c8] ring-2 ring-[#0f3d2e]" : "bg-[#f5e6c8]/30 hover:bg-[#f5e6c8]/50"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Calendar className="w-4 h-4 text-[#0f3d2e]/50" />
                      <span className="text-sm font-medium text-[#0f3d2e]">
                        {day}. {getMonthName()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: winner.color }}
                      >
                        {winner.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-[#0f3d2e]">{winner.name}</span>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Card>
  )
}
