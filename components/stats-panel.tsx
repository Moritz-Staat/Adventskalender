"use client"

import { motion } from "framer-motion"
import { MountedSign, NameStamp } from "@/components/booth"
import type { Participant } from "@/lib/types"

interface StatsPanelProps {
  participants: Participant[]
  winnersByDay: Record<number, string>
  currentCycleWinners: string[]
}

export default function StatsPanel({ participants, winnersByDay, currentCycleWinners }: StatsPanelProps) {
  // Gewinne pro Person zählen
  const winCounts = participants.map((participant) => {
    const wins = Object.values(winnersByDay).filter((id) => id === participant.id).length
    return { participant, wins }
  })

  winCounts.sort((a, b) => b.wins - a.wins)

  // Ein voller Dezember hat 25 Ziehungen, gleichmäßig verteilt
  const maxWins = Math.max(5, Math.ceil(25 / Math.max(participants.length, 1)))

  const eligibleParticipants = participants.filter((p) => !currentCycleWinners.includes(p.id))

  return (
    <div className="plank rounded-2xl p-5 md:p-6">
      <MountedSign>
        <h2 className="sign-text text-[1.4rem] leading-none whitespace-nowrap md:text-[1.7rem]">Gewinnliste</h2>
      </MountedSign>

      <ul className="space-y-3.5">
        {winCounts.map(({ participant, wins }, index) => (
          <li key={participant.id} className="flex items-center gap-3">
            <NameStamp name={participant.name} color={participant.color} size="sm" />
            <span className="w-20 shrink-0 truncate text-[15px] font-semibold text-cream">{participant.name}</span>
            {/* Ein Losabriss pro Gewinn */}
            <span className="flex min-w-0 flex-1 gap-1" aria-hidden>
              {Array.from({ length: maxWins }, (_, i) => (
                <motion.span
                  key={i}
                  className="h-4 flex-1 rounded-[3px]"
                  style={{ backgroundColor: i < wins ? participant.color : "rgb(244 234 214 / 0.08)" }}
                  initial={{ scaleY: 0.3, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.06 + i * 0.03, duration: 0.35 }}
                />
              ))}
            </span>
            <span className="ticket-num w-8 text-right text-lg font-bold text-cream tabular-nums">
              {wins}
              <span className="sr-only"> Gewinne</span>
              <span aria-hidden>×</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-dashed border-cream/15 pt-4">
        <h3 className="text-sm font-semibold text-cream">Dieser Durchgang</h3>
        {eligibleParticipants.length > 0 ? (
          <p className="mt-1 text-sm leading-relaxed text-cream-dim">
            Noch nicht dran: <span className="font-semibold text-cream">{eligibleParticipants.map((p) => p.name).join(", ")}</span>
          </p>
        ) : (
          <p className="mt-1 text-sm text-cream-dim">Alle haben in diesem Durchgang gewonnen. Ab morgen geht es von vorn los.</p>
        )}
      </div>
    </div>
  )
}
