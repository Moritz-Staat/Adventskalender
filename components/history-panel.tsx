"use client"

import { useState } from "react"
import { MountedSign, NameStamp } from "@/components/booth"
import type { Participant } from "@/lib/types"
import { cn } from "@/lib/utils"

interface HistoryPanelProps {
  winnersByDay: Record<number, string>
  participants: Participant[]
  selectedDay: number | null
}

const COLLAPSED_COUNT = 5

export default function HistoryPanel({ winnersByDay, participants, selectedDay }: HistoryPanelProps) {
  const [showAll, setShowAll] = useState(false)

  const allEntries = Object.entries(winnersByDay)
    .map(([day, winnerId]) => ({
      day: Number.parseInt(day),
      winner: participants.find((p) => p.id === winnerId),
    }))
    .filter((entry) => entry.winner)
    .sort((a, b) => b.day - a.day)

  const historyEntries = showAll ? allEntries : allEntries.slice(0, COLLAPSED_COUNT)
  const cycleLength = Math.max(participants.length, 1)

  return (
    <div className="plank rounded-2xl p-5 md:p-6">
      <MountedSign>
        <h2 className="sign-text text-[1.4rem] leading-none whitespace-nowrap md:text-[1.7rem]">Ziehungsprotokoll</h2>
      </MountedSign>

      {allEntries.length === 0 ? (
        <p className="py-8 text-center text-sm text-cream-dim">
          Noch keine Ziehung. Das erste Los fällt am 1. Dezember.
        </p>
      ) : (
        <>
          {/* Liniertes Protokollbuch statt einzelner Karten */}
          <ol className="border-t border-cream/15">
            {historyEntries.map(({ day, winner }) => {
              if (!winner) return null

              const isSelected = selectedDay === day
              const isCycleStart = (day - 1) % cycleLength === 0 && day > 1

              return (
                <li
                  key={day}
                  className={cn(isCycleStart ? "border-b-2 border-dashed border-cream/25" : "border-b border-cream/10")}
                >
                  <div className={cn("flex items-center gap-3 py-2.5", isSelected && "bg-night/50")}>
                    <span className="ticket-num w-8 text-2xl leading-none font-extrabold text-cream tabular-nums">{day}</span>
                    <span className="flex-1 text-sm text-cream-dim">{day}. Dezember</span>
                    <span className="text-sm font-semibold text-cream">{winner.name}</span>
                    <NameStamp name={winner.name} color={winner.color} size="sm" />
                  </div>
                  {isCycleStart && (
                    <p className="ticket-num pb-2 text-[11px] font-semibold tracking-[0.16em] text-cream-dim uppercase">
                      Neuer Durchgang ab Tag {day}
                    </p>
                  )}
                </li>
              )
            })}
          </ol>

          {allEntries.length > COLLAPSED_COUNT && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mt-3 text-sm font-semibold text-bulb underline decoration-bulb/40 underline-offset-4 hover:decoration-bulb"
              aria-expanded={showAll}
            >
              {showAll ? "Weniger anzeigen" : `Alle ${allEntries.length} anzeigen`}
            </button>
          )}
        </>
      )}
    </div>
  )
}
