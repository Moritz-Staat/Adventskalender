"use client"

import { motion } from "framer-motion"
import { Lock, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Participant } from "@/lib/types"

interface CalendarGridProps {
  currentDay: number
  winnersByDay: Record<number, string>
  dayImages: Record<number, string>
  participants: Participant[]
  onDayClick: (day: number) => void
  onImageClick?: (day: number) => void
  isAdmin?: boolean
  onAdminUploadClick?: (day: number) => void
}

export default function CalendarGrid({
  currentDay,
  winnersByDay,
  dayImages,
  participants,
  onDayClick,
  onImageClick,
  isAdmin = false,
  onAdminUploadClick,
}: CalendarGridProps) {
  const days = Array.from({ length: 25 }, (_, i) => i + 1)

  const getWinner = (day: number) => {
    const winnerId = winnersByDay[day]
    return participants.find((p) => p.id === winnerId)
  }

  const getDayStatus = (day: number) => {
    if (day > currentDay) return "future"
    if (day === currentDay) return "today"
    return "past"
  }

  const handleDayClick = (day: number, status: string, winner: any, dayImage: string | undefined) => {
    const isFuture = status === "future"

    // Admin kann alle Tage mit Gewinner anklicken
    if (isAdmin && winner && onAdminUploadClick) {
      onAdminUploadClick(day)
      return
    }

    // Normale User: Nur vergangene Tage mit Bild
    if (isFuture) {
      return
    }

    if (dayImage && onImageClick) {
      onImageClick(day)
      return
    }

    onDayClick(day)
  }

  return (
    <Card className="p-4 md:p-6 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-[#0f3d2e]/10">
      <h2 className="text-2xl font-bold text-[#0f3d2e] mb-6">Adventskalender</h2>

      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {days.map((day) => {
          const status = getDayStatus(day)
          const winner = getWinner(day)
          const dayImage = dayImages[day]
          const isToday = status === "today"
          const isPast = status === "past"
          const isFuture = status === "future"
          const isClickable = isAdmin ? !!winner : !isFuture && !!dayImage
          const showAdminIndicator = isAdmin && winner

          return (
            <motion.button
              key={day}
              onClick={() => {
                handleDayClick(day, status, winner, dayImage)
              }}
              className={`
                relative aspect-square rounded-lg flex flex-col items-center justify-center overflow-hidden
                transition-all duration-300
                ${isClickable ? "cursor-pointer hover:scale-105 hover:shadow-lg" : ""}
                ${!isClickable ? "opacity-50 cursor-not-allowed" : ""}
                ${isToday ? "ring-4 ring-[#b52b3b] ring-offset-2" : ""}
                ${showAdminIndicator ? "ring-2 ring-[#b52b3b]/50 ring-offset-1" : ""}
              `}
              style={{
                backgroundColor: isPast && winner ? winner.color : isFuture ? "#e5e5e5" : "#f5e6c8",
              }}
              whileHover={isClickable ? { y: -4 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
              disabled={!isClickable}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: day * 0.02 }}
            >
              {dayImage && (
                <div
                  className="absolute inset-0 bg-cover bg-center cursor-zoom-in z-0"
                  style={{
                    backgroundImage: `url(${dayImage})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              )}

              {isToday && (
                <motion.div
                  className="absolute -top-1 -right-1 z-20"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Star className="w-4 h-4 text-[#b52b3b] fill-[#b52b3b]" />
                </motion.div>
              )}

              <span
                className={`relative z-10 text-xl md:text-2xl font-bold ${
                  (isPast && winner) || dayImage ? "text-white drop-shadow-lg" : "text-[#0f3d2e]"
                }`}
              >
                {day}
              </span>

              {!dayImage && winner && (
                <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
                  <span className="text-white text-xs md:text-sm font-bold drop-shadow-lg text-center px-1">
                    {winner.name}
                  </span>
                </div>
              )}

              {!winner && isFuture && <Lock className="relative z-10 w-3 h-3 md:w-4 md:h-4 text-[#0f3d2e]/50 mt-1" />}

              {isPast && winner && (
                <div
                  className="absolute bottom-1 right-1 z-10 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/90 flex items-center justify-center text-[10px] md:text-xs font-bold shadow-md pointer-events-none"
                  style={{ color: winner.color }}
                >
                  {winner.name.charAt(0)}
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </Card>
  )
}
