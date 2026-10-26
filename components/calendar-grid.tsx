"use client"

import { motion } from "framer-motion"
import { Camera } from "lucide-react"
import { MountedSign, StarIcon } from "@/components/booth"
import type { Participant } from "@/lib/types"
import { cn } from "@/lib/utils"

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
  const photoCount = Object.keys(dayImages).length

  const getWinner = (day: number) => {
    const winnerId = winnersByDay[day]
    return participants.find((p) => p.id === winnerId)
  }

  const getDayStatus = (day: number) => {
    if (day > currentDay) return "future"
    if (day === currentDay) return "today"
    return "past"
  }

  const handleDayClick = (day: number, status: string, winner: Participant | undefined, dayImage: string | undefined) => {
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
    <div className="plank rounded-2xl p-3 md:p-5">
      <MountedSign className="mb-2">
        <h2 className="sign-text text-[1.4rem] leading-none whitespace-nowrap md:text-[1.7rem]">Gewinnertafel</h2>
      </MountedSign>
      <p className="ticket-num mb-3 text-center text-sm font-semibold tracking-[0.14em] text-cream-dim uppercase">
        {photoCount} {photoCount === 1 ? "Foto" : "Fotos"} an der Tafel
      </p>

      <div className="grid grid-cols-5 gap-1.5 md:gap-2.5">
        {days.map((day) => {
          const status = getDayStatus(day)
          const winner = getWinner(day)
          const dayImage = dayImages[day]
          const isToday = status === "today"
          const isFuture = status === "future"
          const isClickable = isAdmin ? !!winner : !isFuture && !!dayImage
          const label = [
            `${day}. Dezember`,
            isToday ? "heute" : null,
            winner ? `gewonnen von ${winner.name}` : isFuture ? "noch zu" : "nicht ausgelost",
            dayImage ? "mit Foto" : null,
            isAdmin && winner ? "Foto hochladen" : null,
          ]
            .filter(Boolean)
            .join(", ")

          return (
            <motion.button
              key={day}
              type="button"
              aria-label={label}
              onClick={() => handleDayClick(day, status, winner, dayImage)}
              disabled={!isClickable}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-[10px] text-left md:rounded-xl",
                "transition-[transform,box-shadow] duration-200 ease-out",
                isClickable && "cursor-pointer active:scale-[0.96] md:hover:-translate-y-0.5",
                !isClickable && "cursor-default",
                // Zukunft: unbeleuchtet, ins Brett eingelassen
                isFuture && "bg-night shadow-[inset_0_2px_6px_rgb(0_0_0/0.6),inset_0_0_0_1px_rgb(244_234_214/0.05)]",
                !isFuture && !winner && !dayImage && "bg-night-2 shadow-[inset_0_0_0_1px_rgb(244_234_214/0.08)]",
                winner && !dayImage && "ticket-paper shadow-[0_3px_7px_rgb(0_0_0/0.4)]",
                dayImage && "shadow-[0_3px_7px_rgb(0_0_0/0.4)]",
                isToday && "today-tile",
              )}
              style={winner && !dayImage ? { backgroundColor: winner.color } : undefined}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + day * 0.018, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {dayImage && (
                <>
                  <img
                    src={dayImage}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(160deg,rgb(26_15_13/0.55),transparent_45%,rgb(26_15_13/0.5))]" />
                </>
              )}

              <span
                className={cn(
                  "ticket-num absolute top-1 left-1.5 text-[1.55rem] leading-none font-extrabold md:top-1.5 md:left-2 md:text-[2rem]",
                  isFuture && "text-cream/50",
                  !isFuture && !winner && !dayImage && "text-cream-dim",
                  winner && !dayImage && "text-ink",
                  dayImage && "rounded-[6px] bg-night/75 px-1 pt-0.5 text-cream",
                  isToday && !winner && "text-cream",
                )}
              >
                {day}
              </span>

              {winner && !dayImage && (
                <span className="absolute inset-x-1 bottom-1 truncate text-[10px] leading-tight font-bold text-ink/80 md:bottom-1.5 md:text-xs">
                  {winner.name}
                </span>
              )}

              {dayImage && winner && (
                <span
                  className="ticket-num absolute right-1 bottom-1 flex h-5 w-5 items-center justify-center rounded-[5px] text-[11px] font-extrabold text-ink md:h-6 md:w-6 md:text-xs"
                  style={{ backgroundColor: winner.color }}
                >
                  {winner.name.charAt(0)}
                </span>
              )}

              {isToday && (
                <StarIcon className="absolute right-1 bottom-1 h-4 w-4 text-bulb drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)] md:h-5 md:w-5" />
              )}

              {isAdmin && winner && !dayImage && (
                <Camera className="absolute top-1.5 right-1.5 h-3 w-3 text-ink/50 md:h-3.5 md:w-3.5" />
              )}
            </motion.button>
          )
        })}
      </div>

      <p className="mt-4 px-1 text-xs leading-relaxed text-cream-dim md:text-sm">
        {isAdmin
          ? "Als Admin kannst du jedes ausgeloste Feld antippen und ein Foto hochladen."
          : "Tippe auf ein Feld mit Foto, um es groß anzusehen."}
      </p>
    </div>
  )
}
